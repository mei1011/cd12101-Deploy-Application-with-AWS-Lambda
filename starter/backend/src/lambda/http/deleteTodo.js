import middy from '@middy/core'
import { getUserId } from '../utils.mjs'
import { deleteTodoLogic } from '../../businessLogic/todos.mjs'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'


export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {

    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId

    await deleteTodoLogic(userId, todoId)

    return {
      statusCode: 202,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({})
    }
  })