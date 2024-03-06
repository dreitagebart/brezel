import cors from 'cors'
import simpleGit from 'simple-git'
import express, { Request, Response } from 'express'
import { join } from 'path'
import { createClient } from 'redis'
import { getErrorMessage, createId, createSlug } from '@brezel/shared/utils'
import { TypedRequestBody, TypedResponseJSON } from '@brezel/shared/types'
import { config } from '@brezel/shared/config'

const app = express()
const pub = createClient()
const sub = createClient()

pub.connect()
sub.connect()

app.use(cors())
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.json({ hello: 'world' })
})

app.post(
  '/deploy',
  async (
    req: TypedRequestBody<{ repositoryUrl: string }, {}>,
    res: TypedResponseJSON<{ id: string } | { error: string }>
  ) => {
    let slug = ''
    const repository = req.body.repositoryUrl
    const id = createId()

    try {
      slug = createSlug(repository)
    } catch (error) {
      return res.json({ error: getErrorMessage(error) })
    }

    console.log('created id', id)
    console.log('created slug', slug)

    const concatId = `${slug}-${id}`

    await simpleGit().clone(repository, join(config.path.repos, concatId))

    pub.lPush('build-queue', concatId)
    pub.hSet('status', concatId, 'uploaded')

    res.json({
      id: concatId
    })
  }
)

app.get(
  '/status',
  async (
    req: TypedRequestBody<{ id: string }, {}>,
    res: TypedResponseJSON<
      | {
          status: string
        }
      | { error: string }
    >
  ) => {
    const id = req.body.id
    const status = await sub.hGet('status', id)

    if (!status) {
      return res.json({ error: 'status not found' })
    }

    return res.json({ status })
  }
)

app.listen(3000, () =>
  console.log(`🚀 Upload server started on http://localhost:3000`)
)
