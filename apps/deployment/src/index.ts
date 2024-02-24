import { readdirSync } from 'fs'
import { createClient, commandOptions } from 'redis'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'
import { exec } from 'child_process'
import { PackageManagers } from './types'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outputPath = join(__dirname, '..', '..', 'upload', 'public', 'repos')
const pub = createClient()
const sub = createClient()

pub.connect()
sub.connect()

const observe = async () => {
  const response = await sub.brPop(
    commandOptions({ isolated: true }),
    'build-queue',
    0
  )

  console.log('check...')

  if (!response) {
    return
  }

  const id = response.element

  console.log(`deploy repository with id ${id}`)

  await buildProject(id)

  pub.hSet('status', id, 'deployed')

  console.log('repository deployed')

  setTimeout(observe, 1000)
}

const buildProject = (id: string) => {
  return new Promise((resolve) => {
    const pkgManager = detectPackageManager(id)

    const child = exec(
      `cd ${join(
        outputPath,
        id
      )} && ${pkgManager} install && ${pkgManager} run build`
    )

    child.stdout?.on('data', function (data) {
      console.log('stdout: ' + data)
    })

    child.stderr?.on('data', function (data) {
      console.log('stderr: ' + data)
    })

    child.on('close', function (code) {
      resolve('')
    })
  })
}

const detectPackageManager = (id: string): PackageManagers => {
  const files = readdirSync(join(outputPath, id))

  if (files.includes('yarn.lock')) {
    return 'yarn'
  }

  if (files.includes('package-lock.json')) {
    return 'npm'
  }

  if (files.includes('pnpm-lock.yaml')) {
    return 'pnpm'
  }

  if (files.includes('bun.lockb')) {
    return 'bun'
  }

  return 'npm'
}

observe()
