import { resolve } from 'node:path'

export const pkgRoot = resolve(__dirname, '..')
export const repoRoot = resolve(pkgRoot, '../..')

export function getBuildEnv() {
  const mode = process.env.NODE_ENV ?? 'production'

  return {
    mode,
    isProd: mode === 'production',
    isDev: mode === 'development',
    isTest: mode === 'test',
  }
}

export function getBuildDefine() {
  const { isProd, isDev, isTest } = getBuildEnv()

  return {
    PROD: JSON.stringify(isProd),
    DEV: JSON.stringify(isDev),
    TEST: JSON.stringify(isTest),
  }
}
