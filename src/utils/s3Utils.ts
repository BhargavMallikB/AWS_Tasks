import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { User } from "../types/user";
import { Address } from "../types/address";

const s3 = new S3Client({});
const BUCKET_NAME = "users-data-file";
const FILE_KEY = "USER_DATA.json";
const ADDRESS_FILE_KEY = "USER_ADDRESS_DATA.json";

// Convert S3 stream to string using TextDecoder
const streamToString = async (stream: Readable): Promise<string> => {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return new TextDecoder("utf-8").decode(Buffer.concat(chunks));
};

// Read users from S3
export const getUsersFromS3 = async (): Promise<User[]> => {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: FILE_KEY,
    });
    const response = await s3.send(command);
    const body = await streamToString(response.Body as Readable);
    if (!body.trim()) return [];
    return JSON.parse(body) as User[];
  } catch (err) {
    console.error("Error fetching users from S3:", err);
    return [];
  }
};

// Read addresses from S3
export const getAddressesFromS3 = async (): Promise<Address[]> => {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: ADDRESS_FILE_KEY,
    });
    const response = await s3.send(command);
    const body = await streamToString(response.Body as Readable);
    if (!body.trim()) return [];
    return JSON.parse(body) as Address[];
  } catch (err) {
    console.error("Error while fetching the addresses from S3:", err);
    return [];
  }
};

// Save users to S3
export const saveUsersToS3 = async (users: User[]): Promise<void> => {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: FILE_KEY,
    Body: JSON.stringify(users, null, 2),
    ContentType: "application/json",
  });
  await s3.send(command);
};

// Save addresses to S3
export const saveAddressesToS3 = async (addresses: Address[]): Promise<void> => {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: ADDRESS_FILE_KEY,
    Body: JSON.stringify(addresses, null, 2),
    ContentType: "application/json",
  });
  await s3.send(command);
};
