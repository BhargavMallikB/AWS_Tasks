import { APIGatewayProxyHandler } from 'aws-lambda';
import { getUsersFromS3 } from '../utils/s3Utils';

export const handler: APIGatewayProxyHandler = async (event) =>{
    try{
        const userId = Number(event.pathParameters?.id);
        const users = await getUsersFromS3();
        const user = users.find((u) => u.id === userId);

        return {
            statusCode: user ? 200 : 400,
            headers: {
                "Content-Type": "application/json"
              },
            body: JSON.stringify(user || { error: "User Not Found" })
        }
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json"
              },
            body : JSON.stringify({ error: "Failed to fetch User Details" })
        }
    }
}
