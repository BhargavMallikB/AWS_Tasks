import { APIGatewayProxyHandler } from "aws-lambda";
import { getAddressesFromS3 } from "../utils/s3Utils";

export const handler: APIGatewayProxyHandler = async () => {
  try {
    const addresses = await getAddressesFromS3();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(addresses),
    };
  } catch (error) {
    console.error("Error in getAllAddresses handler:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ error: "Failed to fetch addresses from S3" }),
    };
  }
};
