import * as AWS from 'aws-sdk';

const DYNAMO_TABLE_NAME = 'ExampleTable';
const S3_BUCKET_NAME = 'example-bucket';

export const createInfra = async () => {
    const dynamodb = new AWS.DynamoDB();
    const s3 = new AWS.S3();

    // Create DynamoDB Table
    try {
        await createDynamoDBTable(dynamodb);
        console.log(`DynamoDB table '${DYNAMO_TABLE_NAME}' created.`);
    } catch (error) {
        console.error(`Error creating DynamoDB table: ${error.message}`);
    }

    // Create S3 Bucket
    try {
        await createS3Bucket(s3);
        console.log(`S3 bucket '${S3_BUCKET_NAME}' created.`);
    } catch (error) {
        console.error(`Error creating S3 bucket: ${error.message}`);
    }
};

const createDynamoDBTable = (dynamodb: AWS.DynamoDB) => {
    return dynamodb.createTable({
        TableName: DYNAMO_TABLE_NAME,
        KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
        AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
    }).promise();
};

const createS3Bucket = (s3: AWS.S3) => {
    return s3.createBucket({ Bucket: S3_BUCKET_NAME }).promise();
};
