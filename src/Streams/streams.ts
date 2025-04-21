import fs from "fs"; // fs module to read/write files
import readline from "readline"; // readline used to process file line-by-line
import path from "path"; // path module to resolve file paths
import { User } from "../types/User"; // User type to structure data

// File paths for main and temporary user data files
const FILE_PATH = path.join(__dirname, "../data/USER_DATA.jsonl");
const TEMP_FILE = path.join(__dirname, "../data/USER_TEMP.jsonl");

// Reads and returns all users from JSONL file using streams
export function getAllUsersByStreams(): Promise<User[]> {
  return new Promise((resolve, reject) => {
    try {
      const users: User[] = [];

      const rl = readline.createInterface({
        input: fs.createReadStream(FILE_PATH, "utf-8"),
        crlfDelay: Infinity,
      });

      rl.on("line", (line) => {
        try {
          const user = JSON.parse(line); // Parses each line as JSON
          users.push(user); // Adds user to array
        } catch (parseErr) {
          console.warn("Invalid JSON line skipped: ", line); // Skips malformed JSON
        }
      });

      rl.on("close", () => {
        resolve(users); // Returns all collected users
      });

      rl.on("error", (err) => {
        reject(err); // Handles file read errors
      });
    } catch (err) {
      reject(err); // Handles unexpected exceptions
    }
  });
}

// Appends a new user to JSONL file using write stream
export async function insertUserByStreams(
  userDetails: Omit<User, "id">
): Promise<string> {
  try {
    let lastId: number = 0;

    const rl = readline.createInterface({
      input: fs.createReadStream(FILE_PATH, "utf-8"),
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      const user: User = JSON.parse(line);
      if (user.id > lastId) {
        lastId = user.id; // Tracks highest ID
      }
    }

    const newUser: User = {
      id: lastId + 1, // Assigns new unique ID
      ...userDetails,
    };

    const writeStream = fs.createWriteStream(FILE_PATH, { flags: "a" }); // Appends to file
    writeStream.write("\n" + JSON.stringify(newUser));
    writeStream.end();

    return `User inserted with id: ${newUser.id}`; // Success message
  } catch (err) {
    return "Failed to insert User in data"; // Fallback message
  }
}

// Finds and returns a single user by ID using stream
export async function getUserByIdByStreams(
  userId: number
): Promise<User | undefined> {
  try {
    const rl = readline.createInterface({
      input: fs.createReadStream(FILE_PATH, "utf-8"),
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      const user: User = JSON.parse(line);
      if (user.id === userId) {
        return user; // Returns user if found
      }
    }
  } catch (err) {
    return undefined; // Returns undefined if error or not found
  }
}

// Updates user details by ID using temporary write stream
export async function updateUserByIdByStreams(
  userId: number,
  userDetails: Partial<Omit<User, "id">>
): Promise<User> {
  try {
    const rl = readline.createInterface({
      input: fs.createReadStream(FILE_PATH, "utf-8"),
      crlfDelay: Infinity,
    });

    const writeStream = fs.createWriteStream(TEMP_FILE);
    let updatedUser: User;

    for await (const line of rl) {
      const user: User = JSON.parse(line);

      if (user.id === userId) {
        updatedUser = { ...user, ...userDetails }; // Merges new data
        writeStream.write(JSON.stringify(updatedUser) + "\n");
      } else {
        writeStream.write(JSON.stringify(user) + "\n"); // Writes existing data
      }
    }

    writeStream.end();

    await new Promise<void>((resolve) => {
      writeStream.on("finish", () => resolve()); // Waits for file write to finish
    });

    fs.renameSync(TEMP_FILE, FILE_PATH); // Replaces old file with new one
    return updatedUser; // Returns updated user
  } catch (err) {
    console.warn(`Failed to update the data: ${err.message}`); // Logs error
  }
}

// Deletes user by ID by writing to a new file and replacing the original
export async function deleteUserByIdByStreams(
  userId: number
): Promise<User | undefined> {
  try {
    const rl = readline.createInterface({
      input: fs.createReadStream(FILE_PATH, "utf-8"),
      crlfDelay: Infinity,
    });

    const writeStream = fs.createWriteStream(TEMP_FILE);

    let deletedUser: User | undefined;

    for await (const line of rl) {
      const user = JSON.parse(line);

      if (user.id === userId) {
        deletedUser = user; // Skips writing the matched user (deleted)
      } else {
        writeStream.write(JSON.stringify(user) + "\n"); // Writes others
      }
    }

    await new Promise<void>((resolve, reject) => {
      writeStream.end(() => resolve()); // Waits for stream to finish
      writeStream.on("error", reject);
    });

    fs.renameSync(TEMP_FILE, FILE_PATH); // Replaces original file
    return deletedUser; // Returns deleted user
  } catch (err) {
    console.warn(`Failed to delete the User with this id: ${userId}`); // Logs issue
  }
}
