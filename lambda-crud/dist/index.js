"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const aws_sdk_1 = require("aws-sdk");
const dynamoDB = new aws_sdk_1.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME;
const handler = async (event) => {
    try {
        switch (event.operation) {
            case 'create': {
                const user = event.user;
                const item = {
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
                const user = event.user;
                const result = await dynamoDB
                    .get({
                    TableName: TABLE_NAME,
                    Key: { id: user.id },
                })
                    .promise();
                return result.Item;
            }
            case 'update': {
                const user = event.user;
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
                const user = event.user;
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
                return result.Items;
            }
            default:
                throw new Error(`Invalid operation: ${event.operation}`);
        }
    }
    catch (error) {
        throw new Error(`Error performing ${event.operation}: ${error.message}`);
    }
};
exports.handler = handler;
