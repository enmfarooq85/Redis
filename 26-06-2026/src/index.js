import express from "express";
import ioredis from "ioredis";

// creating express app
const app = express();
app.use(express.json());

// creating redis client
const redis = new ioredis(process.env.REDIS_URL || "redis://localhost:6379");

// here we are storing user data in redis as a JSON string and retrieving it when requested
app.post("/user/:id/json", async (req, res) => {
  const userId = req.params.id;
  const userData = req.body;

  await redis.set(`user:${userId}`, JSON.stringify(userData));
  res.send({
    message: "User data stored successfully",
    savedAs: "JSON string",
  });
});

app.get("/user/:id/json", async (req, res) => {
  const userId = req.params.id;
  const userData = await redis.get(`user:${userId}`);

  if (userData) {
    res.send({ data: JSON.parse(userData), retrievedAs: "JSON string" });
  } else {
    res.status(404).send({ message: "User not found" });
  }
});

// here we are storing user data in redis as a hash and retrieving it when requested
app.post("/user/:id/hash", async (req, res) => {
  const userId = req.params.id;
  const userData = req.body;

  await redis.hset(`user:${userId}`, userData);
  res.send({ message: "User data stored successfully", savedAs: "Hash" });
});

app.get("/user/:id/hash", async (req, res) => {
  const userId = req.params.id;
  const userData = await redis.hgetall(`user:${userId}`);

  if (Object.keys(userData).length > 0) {
    res.send({ data: userData, retrievedAs: "Hash" });
  } else {
    res.status(404).send({ message: "User not found" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
