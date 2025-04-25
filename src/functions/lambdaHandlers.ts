import * as AWS from 'aws-sdk';
const dynamodb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

const DYNAMO_TABLE_NAME = 'ExampleTable';
const S3_BUCKET_NAME = 'example-bucket';

export const basicExample = async () => {
    // Insert an item into DynamoDB
    const item = { id: '1', name: 'Example Item' };
    try {
        await dynamodb.put({ TableName: DYNAMO_TABLE_NAME, Item: item }).promise();
        console.log('Item inserted into DynamoDB:', item);
    } catch (error) {
        console.error('Error inserting item into DynamoDB:', error.message);
    }
    return { statusCode: 200, body: JSON.stringify({ message: 'Basic example executed.' }) };
};

export const s3Operations = async () => {
    const key = 'example.txt';
    const content = 'Hello, S3!';

    // Store data in S3
    try {
        await s3.putObject({ Bucket: S3_BUCKET_NAME, Key: key, Body: content }).promise();
        console.log(`Data stored in S3 bucket '${S3_BUCKET_NAME}' with key '${key}'.`);
    } catch (error) {
        console.error('Error storing data in S3:', error.message);
    }

    // Fetch data from S3
    try {
        const result = await s3.getObject({ Bucket: S3_BUCKET_NAME, Key: key }).promise();
        console.log('Data fetched from S3:', result.Body?.toString());
    } catch (error) {
        console.error('Error fetching data from S3:', error.message);
    }

    return { statusCode: 200, body: JSON.stringify({ message: 'S3 operations executed.' }) };
};
