# Redis Notes

## 1. What is Caching

**Caching** is a technique used to store frequently used data in a temporary storage (cache) so that it can be accessed faster.

### Why caching is used:
- Reduces database load
- Improves application speed
- Saves server resources
- Reduces response time

👉 Example:
Instead of fetching user data from database every time, we store it in cache for quick access.

---

## 2. What is Redis

**Redis (Remote Dictionary Server)** is an in-memory data structure store used as a database, cache, and message broker.

It stores data in RAM instead of disk, making it extremely fast.

---

## 3. Why Redis is used

Redis is used because:

- Very fast (in-memory storage)
- Low latency response
- Supports caching
- Supports sessions storage
- Supports pub/sub messaging
- Works well with large-scale applications

---

## 4. When should we use Redis

We should use Redis when:

- We need fast data access
- We want to reduce database load
- We are building real-time apps (chat, notifications)
- We need session management
- We want caching layer in backend systems

---

## 5. Redis Architecture

Redis architecture is simple and lightweight:

### Main components:
- **Redis Client** → Sends commands
- **Redis Server** → Processes requests and stores data in memory
- **Memory (RAM)** → Primary storage location
- **Optional Disk Storage** → For persistence (backup)

### Flow:
Client → Redis Server → RAM → Response back to Client

---

## 6. Internal Working of Redis

Redis works mainly in memory, which makes it very fast.

### Step-by-step working:

1. Client sends request (GET/SET)
2. Redis server receives request
3. Data is searched in memory (RAM)
4. If found → return instantly
5. If not found → fetch from database (if connected)
6. Store result in memory for future use

---

### Key Internal Features:

- **In-memory storage** → faster than disk-based DB
- **Single-threaded event loop** → handles requests efficiently
- **Persistence options**:
  - RDB (Snapshot)
  - AOF (Append Only File)

---

## 7. Redis Data Types

Redis supports multiple data structures:

- Strings
- Hashes
- Lists
- Sets
- Sorted Sets

---

## 8. Summary

Redis is a very fast in-memory database mainly used for:

- Caching
- Session management
- Real-time applications
- Reducing database load