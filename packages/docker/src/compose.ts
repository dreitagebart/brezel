import YAML from 'yaml'
import fs from 'fs'
import { join } from 'path'
import { spawn } from 'child_process'

export class DockerCompose {
  public down(
    callback: Partial<{
      stdout: (data: string) => void
      stderr: (data: string) => void
      close: (code: number) => void
    }>
  ) {
    const composeDown = spawn('docker compose down')

    composeDown.stdout.on('data', (data: string) => {
      if (callback && callback.stdout) {
        callback.stdout(data)
      }
    })

    composeDown.stderr.on('data', (data: string) => {
      if (callback && callback.stderr) {
        callback.stderr(data)
      }
    })

    composeDown.on('close', (code: number) => {
      if (callback && callback.close) {
        callback.close(code)
      }
    })
  }

  public up(
    detached: boolean = true,
    callback: Partial<{
      stdout: (data: string) => void
      stderr: (data: string) => void
      close: (code: number) => void
    }>
  ) {
    const params: Array<string> = []

    if (detached) {
      params.push('-d')
    }

    const composeUp = spawn('docker compose up', params)

    composeUp.stdout.on('data', (data: string) => {
      if (callback && callback.stdout) {
        callback.stdout(data)
      }
    })

    composeUp.stderr.on('data', (data: string) => {
      if (callback && callback.stderr) {
        callback.stderr(data)
      }
    })

    composeUp.on('close', (code: number) => {
      if (callback && callback.close) {
        callback.close(code)
      }
    })
  }

  public createComposeFile({ name }: { name: string }) {
    let output = ''

    output += YAML.stringify({
      version: '3.7'
    })

    output += '\n'

    output += YAML.stringify({
      services: {
        [name]: {
          image: 'image/here',
          container_name: name,
          networks: ['proxy'],
          labels: [
            `traefik.enable=true`,
            `traefik.http.services.${name}.loadbalancer.server.port=3000`
          ]
        }
      }
    })

    output += '\n'

    output += YAML.stringify({
      networks: {
        proxy: {
          external: true
        }
      }
    })

    return output
  }

  public writeComposeFile(data: string, output: string) {
    fs.writeFileSync(join(output, 'compose.yml'), data, {
      encoding: 'utf8'
    })
  }
}
