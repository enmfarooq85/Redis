import express from "express";
import ioredis from "ioredis";

// creating express app
const app = express();
// application level middleware to parse JSON request bodies
app.use(express.json());

// creating redis client
const redis = new ioredis(process.env.REDIS_URL || "redis://localhost:6379");

function otpKey(phone) {
  return `otp:${phone}`;
}

app.post("/send-otp", async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store the OTP in Redis with a TTL of 30 secondsd
  await redis.setex(otpKey(phone), 30, otp);

  // Here you would send the OTP to the user's phone number via SMS
  console.log(`Sending OTP ${otp} to phone number ${phone}`);

  res.json({ message: "OTP sent successfully", otp });
});

app.get("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return res.status(400).json({ error: "Phone number and OTP are required" });
  }

  // Retrieve the OTP from Redis
  const storedOtp = await redis.get(otpKey(phone));

  if (!storedOtp) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  if (storedOtp !== otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  // OTP is valid, delete it from Redis
  await redis.del(otpKey(phone));

  res.json({ message: "OTP verified successfully" });
});

app.get("/otp/:phone/ttl", async (req, res) => {
  const { phone } = req.params;
  if (!phone) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  // Get the TTL of the OTP from Redis
  const ttl = await redis.ttl(otpKey(phone));

  // time gone
  if (ttl === -2) {
    return res
      .status(400)
      .json({ error: "No OTP found for this phone number" });
  }

  res.json({ ttl });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
