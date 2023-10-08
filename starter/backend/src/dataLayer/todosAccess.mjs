import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, PutCommand, DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('todoAccess')
const table = process.env.TODOS_TABLE;
const dbDocument = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-east-1" }));


export const getTodos = async (id) => {
    const command = new QueryCommand({
        TableName: table,
        KeyConditionExpression: 'userId = :id',
        ExpressionAttributeValues: {
            ':id': id
        }
    })
    const result = await dbDocument.send(command)
    return result.Items
}

export const createTodo = async (todo) => {
    const command = new PutCommand({
        TableName: table,
        Item: todo
    })
    await dbDocument.send(command)
    return todo
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
    await docClient.send(command);
}

export const deleteTodo = async (userId, todoId) => {
    const command = new DeleteCommand ({
        TableName: table,
        Key: { userId, todoId }
    });
    await dbDocument.send(command);
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