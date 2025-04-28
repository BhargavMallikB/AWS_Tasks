import { APIGatewayProxyHandler } from 'aws-lambda';
import { getAddressesFromS3, getUsersFromS3, saveUsersToS3 } from '../utils/s3Utils';

export const handler: APIGatewayProxyHandler = async (event) => {
    try{
        const userId = Number(event.pathParameters?.id);
        const updateData = JSON.parse(event.body || "{}");
        const users = await getUsersFromS3();
        const user = users.find((u) => u.id === userId);

        if (!user) {
            return {
                statusCode: 404,
                headers: {
                    "Content-Type": "application/json"
                  },
                body: JSON.stringify({ message: "User Not Found" })
            }
        }

        Object.assign(user, updateData);
        await saveUsersToS3(users);

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
              },
            body: JSON.stringify(user)
        }
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json"
              },
            body: JSON.stringify({ error: "Failed to Update the user" })
        }
    }
}