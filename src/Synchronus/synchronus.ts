import path from "path";
import fs from 'fs';
import { User } from "../types/User";

const FILE_PATH = path.join(__dirname, "../data/USER_DATA.json");

export function getAllUsersSynchronously(): User[] {
  try {
    const data = fs.readFileSync(FILE_PATH, 'utf-8');
    return JSON.parse(data) as User[];
  } catch (err) {
    console.error(`Failed to fetch Users data:`, err);
    return [];
  }
}

export function getUserByIdSynchronously(userId: number): User | undefined {
  try {
    const data = fs.readFileSync(FILE_PATH, 'utf-8');
    const users = JSON.parse(data) as User[];
    return users.find((u) => u.id === userId);
  } catch (err) {
    console.error(`Failed to fetch User with id: ${userId}`, err);
    return undefined;
  }
}

export function insertUserSynchronously(userDetails: Partial<User>): string {
  try {
    const data = fs.readFileSync(FILE_PATH, 'utf-8');
    const users = JSON.parse(data) as User[];
    const len = users.length;

    const newUser: User = {
      id: len + 1,
      ...userDetails
    } as User;

    users.push(newUser);

    fs.writeFileSync(FILE_PATH, JSON.stringify(users, null, 2));

    return users.length > len
      ? "User data successfully inserted"
      : "User data not inserted successfully";
  } catch (err) {
    console.error("Error inserting user:", err);
    return "Failed to insert user data";
  }
}

export function updateUserByIdSynchronously(userId: number, userDetails: Partial<User>): User | undefined {
  try {
    const data = fs.readFileSync(FILE_PATH, 'utf-8');
    const users = JSON.parse(data) as User[];
    const user = users.find((u) => u.id === userId);

    if (!user) return undefined;

    Object.assign(user, userDetails);

    fs.writeFileSync(FILE_PATH, JSON.stringify(users, null, 2));
    return user;
  } catch (err) {
    console.error(`Failed to update user with id ${userId}:`, err);
    return undefined;
  }
}

export function deleteUserByIdSynchronously(userId: number): User | undefined {
  try {
    const data = fs.readFileSync(FILE_PATH, 'utf-8');
    const users = JSON.parse(data) as User[];
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) return undefined;

    const [deletedUser] = users.splice(userIndex, 1);

    fs.writeFileSync(FILE_PATH, JSON.stringify(users, null, 2));
    return deletedUser;
  } catch (err) {
    console.error(`Failed to delete user with id ${userId}:`, err);
    return undefined;
  }
}
