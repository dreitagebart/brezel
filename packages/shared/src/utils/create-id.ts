import { customAlphabet } from 'nanoid'

export const createId = customAlphabet(
  '0123456789abcdefghilklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  5
)
