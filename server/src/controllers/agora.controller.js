import pkg from "agora-access-token";
const { RtcTokenBuilder, RtcRole } = pkg;

const generateAgoraToken = (req, res) => {
  try {
    const uid = req.user.id;
    const { channelName } = req.body;

    if (!channelName) {
      return res.status(400).json({ success: false, message: "channelName is a required field." });
    }

    const role = RtcRole.PUBLISHER;
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const appId = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;

    if (!appId || !appCertificate) {
      console.error("Agora App ID or Certificate is not set in environment variables.");
      return res.status(500).json({ success: false, message: "Server configuration error." });
    }

    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    );

    return res.status(200).json({ success: true, token, uid });
  } catch (error) {
    console.error("Error generating Agora token:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { generateAgoraToken };
