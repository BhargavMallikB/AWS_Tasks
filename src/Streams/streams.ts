import fs, { read, write } from "fs";
import readline from "readline";
import path from "path";
import { User } from "../types/User";

const FILE_PATH = path.join(__dirname, "../data/USER_DATA.jsonl");
const TEMP_FILE = path.join(__dirname, "../data/USER_TEMP.jsonl");

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
          const user = JSON.parse(line);
          users.push(user);
        } catch (parseErr) {
          console.warn("Invalid JSON line skipped: ", line);
        }
      });

      rl.on("close", () => {
        resolve(users);
      });

      rl.on("error", (err) => {
        reject(err);
      });
    } catch (err) {
      reject(err);
    }
  });
}

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
        lastId = user.id;
      }
    }

    const newUser: User = {
      id: lastId + 1,
      ...userDetails,
    };

    const writeStream = fs.createWriteStream(FILE_PATH, { flags: "a" });
    writeStream.write("\n" + JSON.stringify(newUser));
    writeStream.end();

    return `User inserted with id: ${newUser.id}`;
  } catch (err) {
    return "Failed to insert User in data";
  }
}

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
        return user;
      }
    }
  } catch (err) {
    return undefined;
  }
}

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
        updatedUser = { ...user, ...userDetails };
        writeStream.write(JSON.stringify(updatedUser) + "\n");
      } else {
        writeStream.write(JSON.stringify(user) + "\n");
      }
    }

    writeStream.end();

    await new Promise<void>((resolve) => {
      writeStream.on("finish", () => resolve());
    });

    fs.renameSync(TEMP_FILE, FILE_PATH);
    return updatedUser;
  } catch (err) {
    console.warn(`Failed to update the data: ${err.message}`);
  }
}

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
        deletedUser = user;
      } else {
        writeStream.write(JSON.stringify(user) + "\n");
      }
    }

    await new Promise<void>((resolve, reject) => {
      writeStream.end(() => resolve());
      writeStream.on("error", reject);
    });

    fs.renameSync(TEMP_FILE, FILE_PATH);
    return deletedUser;
  } catch (err) {
    console.warn(`Failed to delete the User with this id: ${userId}`);
  }
}
