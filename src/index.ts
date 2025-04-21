import express, { Request, Response } from "express";

// Importing Async-based CRUD functions
import {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  insertUser,
} from "./Asynchronus/asynchronus";

// Importing Sync-based CRUD functions
import {
  deleteUserByIdSynchronously,
  getAllUsersSynchronously,
  getUserByIdSynchronously,
  insertUserSynchronously,
  updateUserByIdSynchronously,
} from "./Synchronus/synchronus";

// Importing Stream-based CRUD functions
import {
  deleteUserByIdByStreams,
  getAllUsersByStreams,
  getUserByIdByStreams,
  insertUserByStreams,
  updateUserByIdByStreams,
} from "./Streams/streams";

const app = express(); // Initializing Express app
const PORT = 8000; // Port where the server will run

app.use(express.json()); // Middleware to parse JSON bodies

// Start server and log server URL
app.listen(PORT, () =>
  console.log(`Server Started at http://localhost:${PORT}`)
);

// ---------------------- ASYNCHRONOUS CRUD ROUTES ----------------------

app
  .route("/api/async/users")
  // GET all users using async method
  .get(async (req: Request, res: Response) => {
    try {
      const data = await getAllUsers();
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  })
  // POST new user using async method
  .post(async (req: Request, res: Response) => {
    try {
      const data = await insertUser(req.body);
      res.json(data);
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ error: "Failed to insert data" });
    }
  });

app
  .route("/api/async/users/:id")
  // GET user by id using async method
  .get(async (req: Request, res: Response) => {
    try {
      const data = await getUserById(Number(req.params.id));
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "Failed to Fetch User data" });
    }
  })
  // PATCH user by id using async method
  .patch(async (req: Request, res: Response) => {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        res
          .status(400)
          .json({ error: "Request body is empty or invalid JSON" });
        return;
      }

      const data = await updateUserById(Number(req.params.id), req);
      if (!data) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "Failed to Update the data" });
    }
  })
  // DELETE user by id using async method
  .delete(async (req: Request, res: Response) => {
    try {
      const data = await deleteUserById(Number(req.params.id));
      if (data === undefined) {
        res.json({
          error: `No Such User registered with id: ${req.params.id}`,
        });
      }
      res.json(data);
    } catch (err) {
      console.log(err.message);
    }
  });

// ---------------------- SYNCHRONOUS CRUD ROUTES ----------------------

app
  .route("/api/sync/users")
  // GET all users using sync method
  .get(async (req: Request, res: Response) => {
    try {
      const data = await getAllUsersSynchronously();
      res.json(data);
    } catch (err) {
      console.error(`Failed to fetch ${err}`);
      res.status(500).json({ err: `Failed to fetch Users` });
    }
  })
  // POST new user using sync method
  .post((req: Request, res: Response) => {
    try {
      const data = insertUserSynchronously(req.body);
      res.json({ msg: data });
    } catch (err) {
      res.status(500).json({ err: `Failed to insert data` });
    }
  });

app
  .route("/api/sync/users/:id")
  // GET user by id using sync method
  .get(async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.id);
      const user = await getUserByIdSynchronously(userId);
      res.json({ user });
    } catch (err) {
      console.error(`Failed to User with id: ${req.params.id}`);
      res.status(500).json({ err });
    }
  })
  // PATCH user by id using sync method
  .patch(async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.id);
      const userDetails = req.body;
      const user = await updateUserByIdSynchronously(userId, userDetails);
      res.json({ user });
    } catch (err) {
      console.error(`Failed to update the User Details`);
      res.status(500).json({ err: err.message });
    }
  })
  // DELETE user by id using sync method
  .delete(async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.id);
      const deletedUser = await deleteUserByIdSynchronously(userId);
      res.json({ deletedUser });
    } catch (err) {
      console.error(err.message);
      res
        .status(500)
        .json({ err: `Failed to Delete with UserId: ${req.params.id}` });
    }
  });

// ---------------------- STREAM-BASED CRUD ROUTES ----------------------

app
  .route("/api/stream/users")
  // GET all users using stream method
  .get(async (req: Request, res: Response) => {
    try {
      const data = await getAllUsersByStreams();
      res.json(data);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  })
  // POST new user using stream method
  .post(async (req: Request, res: Response) => {
    try {
      const message = await insertUserByStreams(req.body);
      res.json({ message: message });
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  });

app
  .route("/api/stream/users/:id")
  // GET user by id using stream method
  .get(async (req: Request, res: Response) => {
    try {
      const user = await getUserByIdByStreams(Number(req.params.id));
      res.json(user);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  })
  // PATCH user by id using stream method
  .patch(async (req: Request, res: Response) => {
    try {
      const updatedUser = await updateUserByIdByStreams(
        Number(req.params.id),
        req.body
      );
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  })
  // DELETE user by id using stream method
  .delete(async (req: Request, res: Response) => {
    try {
      const deletedUser = await deleteUserByIdByStreams(Number(req.params.id));
      res.json(deletedUser);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  });
