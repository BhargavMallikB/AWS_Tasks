import { Request } from "express";
import fs from "fs/promises";
import path from "path";
import { User } from "../types/User";

const FILE_PATH = path.join(__dirname, "../data/USER_DATA.json");

export async function getAllUsers(): Promise<User[] | []> {
  try {
    const data = await fs.readFile(FILE_PATH, "utf-8");
    return JSON.parse(data) as User[];
  } catch (e: any) {
    console.error("Failed to read users file:", e.message);
    return []; // fallback to empty array
  }
}

export async function getUserById(userId: number): Promise<User | undefined> {
  try {
    const data = await fs.readFile(FILE_PATH, "utf-8");
    const users: User[] = JSON.parse(data);
    return users.find((u) => u.id === userId);
  } catch (e: any) {
    console.error("Failed to read users file:", e.message);
    return undefined; // fallback when error occurs
  }
}

export async function updateUserById(
  userId: number,
  req: Request
): Promise<User | undefined> {
  try {
    const data = await fs.readFile(FILE_PATH, "utf-8");
    const users: User[] = JSON.parse(data);
    const user = users.find((u) => u.id === userId);

    if (!user) return undefined;

    Object.assign(user, req.body);

    await fs.writeFile(FILE_PATH, JSON.stringify(users, null, 2));
    return user;
  } catch (e: any) {
    console.error("Failed to update the user data:", e.message);
    return undefined;
  }
}

export async function deleteUserById(userId: number) {
  try {
    const data = await fs.readFile(FILE_PATH, "utf-8");
    const users = JSON.parse(data);
    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return undefined;
    }
    console.log(userIndex);

    // Remove user from the array
    const deletedUser = users.splice(userIndex, 1);

    await fs.writeFile(FILE_PATH, JSON.stringify(users, null, 2));
    return deletedUser;
  } catch (err) {
    console.error("Failed to Delete the User", err.message);
    return undefined;
  }
}

export async function insertUser(userDetails) {
  const data = await fs.readFile(FILE_PATH, "utf-8");
  const users = JSON.parse(data);
  const len = users.length;
  users.push({ id: users.length + 1, ...userDetails });

  await fs.writeFile(FILE_PATH, JSON.stringify(users, null, 2));
  if (users.length > len) {
    return "Successfully data inserted";
  } else {
    return "Data Not Inserted to a file";
  }
}
