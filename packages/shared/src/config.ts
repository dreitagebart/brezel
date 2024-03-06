import { fileURLToPath } from 'url'
import { join, dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicPath = join(__dirname, '..', '..', '..', 'public')

export const config = {
  path: {
    public: publicPath,
    output: join(publicPath, 'output'),
    repos: join(publicPath, 'repos')
  }
}
