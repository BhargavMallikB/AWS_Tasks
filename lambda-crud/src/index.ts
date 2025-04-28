import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME!;

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  job_title: string;
}

interface LambdaEvent {
  operation: 'create' | 'read' | 'update' | 'delete' | 'list';
  user?: Partial<User>;
}

interface LambdaResponse {
  statusCode: number;
  body: string;
}

export const handler = async (event: LambdaEvent): Promise<User | User[] | { message: string } | null> => {
  try {
    switch (event.operation) {
      case 'create': {
        const user = event.user as User;
        const item: User = {
          id: user.id || Math.floor(Math.random() * 1000000), // Generate ID if not provided
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          gender: user.gender,
          job_title: user.job_title,
        };

        await dynamoDB
          .put({
            TableName: TABLE_NAME,
            Item: item,
          })
          .promise();

        return item;
      }

      case 'read': {
        const user = event.user as { id: number };
        const result = await dynamoDB
          .get({
            TableName: TABLE_NAME,
            Key: { id: user.id },
          })
          .promise();

        return result.Item as User | null;
      }

      case 'update': {
        const user = event.user as User;
        await dynamoDB
          .update({
            TableName: TABLE_NAME,
            Key: { id: user.id },
            UpdateExpression: 'set first_name = :fn, last_name = :ln, email = :e, gender = :g, job_title = :jt',
            ExpressionAttributeValues: {
              ':fn': user.first_name,
              ':ln': user.last_name,
              ':e': user.email,
              ':g': user.gender,
              ':jt': user.job_title,
            },
          })
          .promise();

        return user;
      }

      case 'delete': {
        const user = event.user as { id: number };
        await dynamoDB
          .delete({
            TableName: TABLE_NAME,
            Key: { id: user.id },
          })
          .promise();

        return { message: 'User deleted' };
      }

      case 'list': {
        const result = await dynamoDB
          .scan({
            TableName: TABLE_NAME,
          })
          .promise();

        return result.Items as User[];
      }

      default:
        throw new Error(`Invalid operation: ${event.operation}`);
    }
  } catch (error) {
    throw new Error(`Error performing ${event.operation}: ${(error as Error).message}`);
  }
};