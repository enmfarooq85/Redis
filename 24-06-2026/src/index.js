import express from "express";
import ioredis from "ioredis";

// creating express app
const app = express();
app.use(express.json());

// creating redis client
const redis = new ioredis(process.env.REDIS_URL || "redis://localhost:6379");

const BANNER_KEY = "app:banner";

app.post("/banner", async (req, res) => {
  const message = req.body.message;

  if (!message) {
    return res.status(400).send({
      error: "message is required",
    });
  }

  await redis.set(BANNER_KEY, message);

  res.send({
    message: "Banner set successfully",
    success: true,
  });
});

app.get("/banner", async (req, res) => {
  const message = await redis.get(BANNER_KEY);

  if (!message) {
    return res.status(404).send({
      error: "message not found",
    });
  }

  res.send({
    message,
  });
});

app.delete("/banner", async (req, res) => {
  await redis.del(BANNER_KEY);

  res.send({
    message: "Banner deleted successfully",
    success: true,
  });
});

app.get("/banner/exists", async (req, res) => {
  const exists = await redis.exists(BANNER_KEY);

  res.send({
    exists: Boolean(exists),
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
