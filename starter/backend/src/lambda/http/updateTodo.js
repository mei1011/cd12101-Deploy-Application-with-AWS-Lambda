
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { updateTodoLogic } from '../../businessLogic/todos.mjs'
import middy from '@middy/core'
import cors from '@middy/http-cors'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const updatedTodo = JSON.parse(event.body)
    const todoId = event.pathParameters.todoId
   
    const userId = getUserId(event)
    const todo = await updateTodoLogic(userId, todoId, updatedTodo)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(todo)
    }
  })