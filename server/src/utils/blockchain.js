import { ethers } from "ethers";

// This ABI should match your deployed LogStorage smart contract.
// It assumes a function `storeLog(string logId, string logType, string logData)`
const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "logId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "logType",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "logData",
        "type": "string"
      }
    ],
    "name": "storeLog",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "logId",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "logType",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "dataHash",
        "type": "string"
      }
    ],
    "name": "LogStored",
    "type": "event"
  }
];
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const LOCAL_RPC_URL = process.env.BLOCKCHAIN_RPC_URL;
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;

/**
 * Logs data to the blockchain by calling a smart contract function.
 * @param {object} logDetails - The details of the log to be stored.
 * @param {string} logDetails.logId - The MongoDB ID of the log entry.
 * @param {string} logDetails.logData - The log data, as a JSON string.
 * @param {string} logDetails.logType - The type of the log (e.g., "Simulation", "System").
 * @returns {Promise<string|null>} The transaction hash if successful, otherwise null.
 */
export const logToBlockchain = async (logDetails) => {
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

    const { logId, logData, logType } = logDetails;

    // Call the smart contract function to store the log
    const tx = await contract.storeLog(
      logId,
      logType,
      logData // logData is already a JSON string from the controller
    );

    // Wait for the transaction to be mined
    await tx.wait();
    console.log("Log data sent to blockchain! Transaction hash:", tx.hash);
    return tx.hash;
  } catch (error) {
    console.error("Error logging data to blockchain:", error);
    // Return null to indicate failure without crashing the app
    return null;
  }
};
