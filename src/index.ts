import express, { Request, Response } from "express";
import {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  insertUser,
} from "./Asynchronus/asynchronus";
import {
  deleteUserByIdSynchronously,
  getAllUsersSynchronously,
  getUserByIdSynchronously,
  insertUserSynchronously,
  updateUserByIdSynchronously,
} from "./Synchronus/synchronus";

const app = express();
const PORT = 8000;

app.use(express.json());

app.listen(PORT, () =>
  console.log(`Server Started at http://localhost:${PORT}`)
);

// Make the route handler async
app
  .route("/api/async/users")
  .get(async (req: Request, res: Response) => {
    try {
      const data = await getAllUsers(); // Await the async function
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  })
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
  .get(async (req: Request, res: Response) => {
    try {
      const data = await getUserById(Number(req.params.id));
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "Failed to Fetch User data" });
    }
  })
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

app
  .route("/api/sync/users")
  .get(async (req: Request, res: Response) => {
    try {
      const data = await getAllUsersSynchronously();
      res.json(data);
    } catch (err) {
      console.error(`Failed to fetch ${err}`);
      res.status(500).json({ err: `Failed to fetch Users` });
    }
  })
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
