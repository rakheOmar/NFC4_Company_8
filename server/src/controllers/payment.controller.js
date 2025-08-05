import crypto from "crypto";
import { ethers } from "ethers";
import { razorpay } from "../utils/razorpay.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Payment } from "../models/payment.model.js";

const CONTRACT_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "razorpay_order_id",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "razorpay_payment_id",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "currency",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "PaymentLogged",
    type: "event",
  },
  {
    inputs: [],
    name: "getPaymentsCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_razorpay_order_id",
        type: "string",
      },
      {
        internalType: "string",
        name: "_razorpay_payment_id",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_currency",
        type: "string",
      },
    ],
    name: "logPayment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "payments",
    outputs: [
      {
        internalType: "string",
        name: "razorpay_order_id",
        type: "string",
      },
      {
        internalType: "string",
        name: "razorpay_payment_id",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "currency",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const LOCAL_RPC_URL = process.env.BLOCKCHAIN_RPC_URL;
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;

const logPaymentToBlockchain = async (paymentData) => {
  if (!CONTRACT_ADDRESS || !LOCAL_RPC_URL || !WALLET_PRIVATE_KEY || !CONTRACT_ABI) {
    console.error(
      "Blockchain environment variables or ABI are not configured. Skipping blockchain log."
    );
    return null;
  }

  try {
    const provider = new ethers.JsonRpcProvider(LOCAL_RPC_URL);
    const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

    const { razorpay_order_id, razorpay_payment_id, amount, currency } = paymentData;
    const amountInSmallestUnit = Math.round(amount * 100);

    const tx = await contract.logPayment(
      razorpay_order_id,
      razorpay_payment_id,
      amountInSmallestUnit,
      currency
    );

    await tx.wait();
    console.log("Payment logged to LOCAL blockchain! Transaction hash:", tx.hash);
    return tx.hash;
  } catch (error) {
    console.error("Error logging payment to local blockchain:", error);
    return null;
  }
};

export const createOrder = asyncHandler(async (req, res) => {
  const { amount, currency = "INR", receipt = "receipt#1" } = req.body;

  if (!amount) {
    throw new ApiError(400, "Amount is required");
  }

  const options = {
    amount: amount * 100,
    currency,
    receipt,
  };

  const order = await razorpay.orders.create(options);

  if (!order) {
    throw new ApiError(500, "Failed to create Razorpay order");
  }

  res.status(200).json(new ApiResponse(200, "Order created successfully", order));
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, currency } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !amount || !currency) {
    throw new ApiError(400, "All payment verification fields are required.");
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (!isAuthentic) {
    throw new ApiError(400, "Invalid signature. Payment verification failed.");
  }

  const blockchainTxHash = await logPaymentToBlockchain({
    razorpay_order_id,
    razorpay_payment_id,
    amount,
    currency,
  });

  const payment = await Payment.create({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    amount,
    currency,
    user: req.user?._id,
    status: "paid",
    blockchain_tx_hash: blockchainTxHash,
  });

  if (!payment) {
    throw new ApiError(500, "Payment was verified but failed to save to the database.");
  }

  const populatedPayment = await payment.populate("user", "fullName email avatar");

  const io = req.app.get("io");
  io.emit("new_payment", populatedPayment);

  res.status(200).json(
    new ApiResponse(200, "Payment verified successfully and logged.", {
      isVerified: true,
      razorpay_payment_id,
      dbId: payment._id,
      blockchainTxHash: blockchainTxHash || "Logging failed or was skipped.",
    })
  );
});

export const getAllPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({})
    .populate("user", "fullname email avatar")
    .sort({ createdAt: -1 });

  if (!payments) {
    throw new ApiError(404, "No payments found");
  }
  return res.status(200).json(new ApiResponse(200, "Payments retrieved successfully", payments));
});
