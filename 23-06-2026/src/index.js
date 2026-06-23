import express from "express";
import ioredis from "ioredis";
import mongoose from "mongoose";

// creating express app
const app = express();

// creating redis client
const redis = new ioredis(process.env.REDIS_URL || "redis://localhost:6379");

app.get("/redis", async (req, res) => {
  const reply = await redis.ping();
  res.send({
    reply,
  });
});

app.get("/mongo", async (req, res) => {
  const url = process.env.MONGO_URL || "mongodb://localhost:27017/redis-db";

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(url);
  }

  res.send({
    mongo: "connected",
    database: mongoose.connection.name,
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
