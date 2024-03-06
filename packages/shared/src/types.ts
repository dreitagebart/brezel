import { Request, Response } from 'express'
import { Send, Query } from 'express-serve-static-core'
import { frameworkPresets } from './utils/get-build-config'

export interface TypedRequestBody<B, Q extends Query> extends Request {
  body: B
  query: Q
}

export interface TypedResponseJSON<J> extends Response {
  json: Send<J, this>
}

export type BuildConfig = {
  buildCommand: string
  outputDirectory: string
  installCommand: string
}

export type BuildConfigMap<T extends string> = Record<T, BuildConfig>

export type PackageManagers = 'yarn' | 'pnpm' | 'npm' | 'bun'

export type FrameworkPresets = (typeof frameworkPresets)[number]

export type RepositoryConfig = BuildConfig & {
  packageManager: PackageManagers
  preset: FrameworkPresets
}
