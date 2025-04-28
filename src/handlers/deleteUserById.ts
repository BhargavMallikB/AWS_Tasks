import { APIGatewayProxyHandler } from 'aws-lambda';
import { getUsersFromS3, saveUsersToS3 } from '../utils/s3Utils';

export const handler: APIGatewayProxyHandler = async (event) => {
    try {
        const userId = Number(event.pathParameters?.id);
        const users = await getUsersFromS3();
        const index = users.findIndex((u) => u.id === userId);

        if (index === -1){
            return {
                statusCode: 404,
                headers: {
                    "Content-Type": "application/json"
                  },
                body: JSON.stringify({ error: `No such user exists with Id: ${userId}` })
            }
        }

        const [deleteUser] = users.splice(index, 1);
        await saveUsersToS3(users);

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
              },
            body: JSON.stringify({ message: "User Deleted", user: deleteUser })
        }
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json"
              },
            body: JSON.stringify({ error: "Failed to Delete user" })
        }
    }
}