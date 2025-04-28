import { APIGatewayProxyHandler } from "aws-lambda";
import {
  getAddressesFromS3,
  getUsersFromS3,
  saveAddressesToS3,
  saveUsersToS3,
} from "../utils/s3Utils";
import { Address } from "../types/address";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const userDetails = JSON.parse(event.body || "{}");
    const users = await getUsersFromS3();
    const addresses = await getAddressesFromS3();
    const newUserId = users.length + 1;

    const newUser = {
      id: newUserId,
      first_name: userDetails.first_name,
      last_name: userDetails.last_name,
      email: userDetails.email,
      gender: userDetails.gender,
      job_title: userDetails.job_title,
    };

    const userAddresses = (userDetails.addresses || []).map((address: any) => ({
      id: newUserId,
      ...address
    }))
    users.push(newUser);
    addresses.push(...userAddresses);

    await Promise.all([ saveUsersToS3(users), saveAddressesToS3(addresses) ]);

    return {
      statusCode: 201,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "Insert Successful", user: newUser }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: "Failed to insert user details" }),
    };
  }
};
