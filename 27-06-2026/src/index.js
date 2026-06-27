import express from "express";
import ioredis from "ioredis";

// creating express app
const app = express();
app.use(express.json());

// creating redis client
const redis = new ioredis(process.env.REDIS_URL || "redis://localhost:6379");

const EMAIL_QUEUE = "queue:emails";

app.post("/add/email", async (req, res) => {
  const { to, from, subject, body } = req.body;

  if (!to || !from || !subject || !body) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }

  await redis.lpush(EMAIL_QUEUE, JSON.stringify({ from, to, subject, body }));

  return res.status(201).json({
    message: "Email added to queue",
    email: { from, to, subject, body },
  });
});

app.get("/get/email", async (req, res) => {
  const emails = await redis.lpop(EMAIL_QUEUE);

  return res.status(200).json({
    message: "Email fetched successfully",
    email: emails ? JSON.parse(emails) : null,
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
