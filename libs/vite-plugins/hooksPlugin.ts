import { each, isFunction } from 'lodash-es'
import shell from 'shelljs'

import type { Plugin } from 'vite'

type HookCallback = () => void | Promise<void>

export interface FileTransformOptions {
  from: string
  to: string
}

export interface HooksPluginOptions {
  rmFiles?: string[]
  cpFiles?: FileTransformOptions[]
  mvFiles?: FileTransformOptions[]
  beforeBuild?: HookCallback
  afterBuild?: HookCallback
}

export default function hooksPlugin({
  rmFiles = [],
  cpFiles = [],
  mvFiles = [],
  beforeBuild,
  afterBuild,
}: HooksPluginOptions = {}): Plugin {
  let buildError: Error | undefined

  return {
    name: 'moe-ui:hooks-plugin',
    buildStart() {
      buildError = undefined

      each(rmFiles, (fileName) => {
        shell.rm('-rf', fileName)
      })

      if (isFunction(beforeBuild)) {
        return beforeBuild()
      }
    },
    buildEnd(error?: Error) {
      buildError = error
    },
    async closeBundle() {
      if (buildError) return

      each(cpFiles, ({ from, to }) => {
        if (shell.test('-e', from)) {
          shell.cp('-R', from, to)
        }
      })

      each(mvFiles, ({ from, to }) => {
        if (shell.test('-e', from)) {
          shell.mv(from, to)
        }
      })

      if (isFunction(afterBuild)) {
        return afterBuild()
      }
    },
  }
}
