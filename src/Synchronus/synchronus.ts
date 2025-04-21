import path from "path"; // path module imported to resolve file location
import fs from "fs"; // fs module used for synchronous file operations
import { User } from "../types/User"; // User type imported to define structure of data

// Resolves the complete path to the JSON file where user data is stored
const FILE_PATH = path.join(__dirname, "../data/USER_DATA.json");

// Fetches and returns all users synchronously from the JSON file
export function getAllUsersSynchronously(): User[] {
  try {
    const data = fs.readFileSync(FILE_PATH, "utf-8"); // Reads file content
    return JSON.parse(data) as User[]; // Parses JSON and returns as user array
  } catch (err) {
    console.error(`Failed to fetch Users data:`, err); // Logs any read/parse error
    return []; // Returns empty array if error occurs
  }
}

// Fetches a single user by ID synchronously from the JSON file
export function getUserByIdSynchronously(userId: number): User | undefined {
  try {
    const data = fs.readFileSync(FILE_PATH, "utf-8"); // Reads file
    const users = JSON.parse(data) as User[]; // Parses to array of users
    return users.find((u) => u.id === userId); // Finds and returns user by ID
  } catch (err) {
    console.error(`Failed to fetch User with id: ${userId}`, err); // Logs error if any
    return undefined; // Fallback if user not found or error
  }
}

// Inserts a new user into the file synchronously
export function insertUserSynchronously(userDetails: Partial<User>): string {
  try {
    const data = fs.readFileSync(FILE_PATH, "utf-8"); // Reads current data
    const users = JSON.parse(data) as User[]; // Parses existing users
    const len = users.length; // Tracks initial user count

    const newUser: User = {
      id: len + 1, // Assigns next available ID
      ...userDetails, // Spreads additional user details
    } as User;

    users.push(newUser); // Adds new user to list

    fs.writeFileSync(FILE_PATH, JSON.stringify(users, null, 2)); // Saves updated user list

    return users.length > len
      ? "User data successfully inserted" // Returns success message
      : "User data not inserted successfully"; // Fallback message if not added
  } catch (err) {
    console.error("Error inserting user:", err); // Logs insertion error
    return "Failed to insert user data"; // Fallback message
  }
}

// Updates a user synchronously by their ID
export function updateUserByIdSynchronously(
  userId: number,
  userDetails: Partial<User>
): User | undefined {
  try {
    const data = fs.readFileSync(FILE_PATH, "utf-8"); // Reads current user data
    const users = JSON.parse(data) as User[]; // Parses into user array
    const user = users.find((u) => u.id === userId); // Finds user by ID

    if (!user) return undefined; // Returns if user not found

    Object.assign(user, userDetails); // Merges user data with updates

    fs.writeFileSync(FILE_PATH, JSON.stringify(users, null, 2)); // Saves updated user list
    return user; // Returns updated user
  } catch (err) {
    console.error(`Failed to update user with id ${userId}:`, err); // Logs error
    return undefined; // Fallback if error occurs
  }
}

// Deletes a user synchronously by their ID
export function deleteUserByIdSynchronously(userId: number): User | undefined {
  try {
    const data = fs.readFileSync(FILE_PATH, "utf-8"); // Reads user data
    const users = JSON.parse(data) as User[]; // Parses user array
    const userIndex = users.findIndex((u) => u.id === userId); // Finds user index by ID

    if (userIndex === -1) return undefined; // Returns if user not found

    const [deletedUser] = users.splice(userIndex, 1); // Removes user from list

    fs.writeFileSync(FILE_PATH, JSON.stringify(users, null, 2)); // Writes updated list to file
    return deletedUser; // Returns deleted user
  } catch (err) {
    console.error(`Failed to delete user with id ${userId}:`, err); // Logs error
    return undefined; // Fallback if error occurs
  }
}
