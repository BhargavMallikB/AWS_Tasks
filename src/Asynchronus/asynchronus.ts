import { Request } from "express"; // Request imported from express for request type in updateUser function
import fs from "fs/promises"; // Promises version of fs module to handle file read/write operations asynchronously
import path from "path"; // path module imported to resolve file path locations
import { User } from "../types/User"; // Importing User type to define structure of user data

// Constructing full path to the JSON file storing user data
const FILE_PATH = path.join(__dirname, "../data/USER_DATA.json");

// Fetches and returns all users from the file
export async function getAllUsers(): Promise<User[] | []> {
  try {
    const data = await fs.readFile(FILE_PATH, "utf-8"); // Reading file content
    return JSON.parse(data) as User[]; // Parsing JSON and returning as an array of users
  } catch (e: any) {
    console.error("Failed to read users file:", e.message); // Logs error if reading fails
    return []; // Returns empty array as fallback
  }
}

// Gets a single user by their ID from the JSON file
export async function getUserById(userId: number): Promise<User | undefined> {
  try {
    const data = await fs.readFile(FILE_PATH, "utf-8"); // Reading the file
    const users: User[] = JSON.parse(data); // Parsing data into user array
    return users.find((u) => u.id === userId); // Finding user by ID
  } catch (e: any) {
    console.error("Failed to read users file:", e.message); // Logs error if read fails
    return undefined; // Fallback if error occurs
  }
}

// Updates a user by their ID using request body from client
export async function updateUserById(
  userId: number,
  req: Request
): Promise<User | undefined> {
  try {
    const data = await fs.readFile(FILE_PATH, "utf-8"); // Reading file
    const users: User[] = JSON.parse(data); // Parsing user data
    const user = users.find((u) => u.id === userId); // Finding user by ID

    if (!user) return undefined; // If user doesn't exist, return undefined

    Object.assign(user, req.body); // Updating user fields with values from request body

    await fs.writeFile(FILE_PATH, JSON.stringify(users, null, 2)); // Saving updated data to file
    return user; // Returning updated user
  } catch (e: any) {
    console.error("Failed to update the user data:", e.message); // Logs error
    return undefined; // Fallback
  }
}

// Deletes a user from the file by their ID
export async function deleteUserById(userId: number) {
  try {
    const data = await fs.readFile(FILE_PATH, "utf-8"); // Reading current data
    const users = JSON.parse(data); // Parsing into user array
    const userIndex = users.findIndex((user) => user.id === userId); // Finding user index

    if (userIndex === -1) {
      return undefined; // If user not found, return undefined
    }

    console.log(userIndex); // Logging index of user to be deleted

    const deletedUser = users.splice(userIndex, 1); // Removing user from array

    await fs.writeFile(FILE_PATH, JSON.stringify(users, null, 2)); // Saving updated user list
    return deletedUser; // Returning deleted user
  } catch (err) {
    console.error("Failed to Delete the User", err.message); // Logs any error during delete
    return undefined; // Fallback
  }
}

// Inserts a new user into the file with auto-generated ID
export async function insertUser(userDetails) {
  const data = await fs.readFile(FILE_PATH, "utf-8"); // Reading current file data
  const users = JSON.parse(data); // Parsing user data
  const len = users.length; // Tracking length before insertion

  users.push({ id: users.length + 1, ...userDetails }); // Adding new user with next available ID

  await fs.writeFile(FILE_PATH, JSON.stringify(users, null, 2)); // Saving updated data

  // Confirming if user was successfully added by comparing length
  if (users.length > len) {
    return "Successfully data inserted"; // Insert success message
  } else {
    return "Data Not Inserted to a file"; // Insert failure message
  }
}
