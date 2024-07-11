// handler.js
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME || 'Notifications';

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const { message } = body;

    const params = {
        TableName: TABLE_NAME,
        Item: {
            id: Date.now().toString(),
            message: message
        }
    };

    try {
        await dynamoDb.put(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ id: params.Item.id })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
