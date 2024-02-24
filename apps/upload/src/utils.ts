import slugify from '@sindresorhus/slugify'
import { customAlphabet } from 'nanoid'

export const createId = customAlphabet(
  '0123456789abcdefghilklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  5
)

export const createSlug = (respository: string) => {
  const url = new URL(respository)
  const paths = url.pathname.split('/')
  const slug = paths[paths.length - 1]?.replace('.git', '')

  if (!slug) {
    throw new Error('No valid git url')
  }

  return slugify(slug)
}
