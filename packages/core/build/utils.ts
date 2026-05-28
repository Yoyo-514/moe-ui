import { readdirSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { find, filter } from 'lodash-es'
import { normalizePath } from 'vite'

export const pkgRoot = resolve(__dirname, '..')
export const repoRoot = resolve(pkgRoot, '../..')

export function getDirectoriesSync(path: string) {
  return filter(readdirSync(path), (item) => statSync(resolve(path, item)).isDirectory())
}

export function getPackageDirChunkName(id: string, packageDir: string) {
  const normalizedId = normalizePath(id)
  const normalizedPackageDir = normalizePath(packageDir)
  const directories = getDirectoriesSync(normalizedPackageDir)

  return find(directories, (item) => normalizedId.includes(`${normalizedPackageDir}/${item}`))
}
