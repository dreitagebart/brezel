import { Request, Response } from 'express'
import { Send, Query } from 'express-serve-static-core'

export interface TypedRequestBody<B, Q extends Query> extends Request {
  body: B
  query: Q
}

export interface TypedResponseJSON<J> extends Response {
  json: Send<J, this>
}
