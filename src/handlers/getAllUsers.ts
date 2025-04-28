import { APIGatewayProxyHandler } from 'aws-lambda';
import { getUsersFromS3 } from '../utils/s3Utils';

export const handler: APIGatewayProxyHandler = async () => {
    try {
        const users = await getUsersFromS3();
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
              },
            body: JSON.stringify(users)
        }
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json"
              },
            body: JSON.stringify({ error: 'Failed to fetch User Details' })
        }
    }
}
