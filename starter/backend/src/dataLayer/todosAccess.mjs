import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, PutCommand, DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { createLogger } from '../utils/logger.mjs'

import AWSXRay from 'aws-xray-sdk-core'

const dynamoDb = new DynamoDBClient({ region: "us-east-1" });
const dynamoDbXRay = AWSXRay.captureAWSv3Client(dynamoDb)
const dbDocument = DynamoDBDocumentClient.from(dynamoDbXRay)

const logger = createLogger('todoAccess')
const todosTable = process.env.TODOS_TABLE;

export const createTodo = async (todo) => {
    const command = new PutCommand({
        TableName: todosTable,
        Item: todo
    })
    await dbDocument.send(command)
    return todo
}

export const deleteTodo = async (userId, todoId) => {
    const command = new DeleteCommand ({
        TableName: todosTable,
        Key: { userId, todoId }
    });
    await dbDocument.send(command);
}

export const getTodos = async (id) => {
    const command = new QueryCommand({
        TableName: todosTable,
        KeyConditionExpression: 'userId = :id',
        ExpressionAttributeValues: {
            ':id': id
        }
    })
    const result = await dbDocument.send(command)
    return result.Items
}

export const saveImgUrl = async (userId, todoId, bucketName) => {
    try {
        const command = new UpdateCommand({
            TableName: todosTable,
            Key: { userId, todoId },
            ConditionExpression: 'attribute_exists(todoId)',
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': `https://${bucketName}.s3.amazonaws.com/${todoId}`,
            }
        })
        await dbDocument.send(command);
    } catch (error) {
        logger.error(error)
    }
}

export const updateTodo = async (userId, todoId, updateData) => {
    const command = new UpdateCommand({
        TableName: todosTable,
        Key: { userId, todoId },
        ConditionExpression: 'attribute_exists(todoId)',
        UpdateExpression: 'set #n = :n, dueDate = :due, done = :dn',
        ExpressionAttributeNames: { '#n': 'name' },
        ExpressionAttributeValues: {
            ':n': updateData.name,
            ':due': updateData.dueDate,
            ':dn': updateData.done,
        }
    })
    await dbDocument.send(command);
}