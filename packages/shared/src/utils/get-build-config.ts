import {
  BuildConfig,
  BuildConfigMap,
  FrameworkPresets,
  PackageManagers
} from '../types'

export const frameworkPresets = ['next', 'vite', 'gatsby'] as const

export const buildConfig: BuildConfigMap<FrameworkPresets> = {
  next: {
    buildCommand: '{pm} run build',
    installCommand: '{pm} install',
    outputDirectory: './.next'
  },
  vite: {
    buildCommand: '{pm} run build',
    installCommand: '{pm} install',
    outputDirectory: './dist'
  },
  gatsby: {
    buildCommand: '{pm} run build',
    installCommand: '{pm} install',
    outputDirectory: './dist'
  }
}

export const getBuildConfig = (
  packageManager: PackageManagers,
  preset: FrameworkPresets
): BuildConfig => {
  let config = buildConfig[preset]

  const keys = Object.keys(config) as Array<keyof typeof config>

  keys.forEach((key) => {
    config[key] = config[key].replace('{pm}', packageManager)
  })

  return config
}
