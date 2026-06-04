import { isString } from 'lodash-es'

const warnedMessages = new Set<string>()

class MoeUIError extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'MoeUIError'
  }
}

function isProduction() {
  const nodeEnv = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env
    ?.NODE_ENV

  return nodeEnv === 'production'
}

export function formatErrorMessage(scope: string, msg: string) {
  return `[${scope}]: ${msg}`
}

export function createMoeUIError(scope: string, msg: string) {
  return new MoeUIError(formatErrorMessage(scope, msg))
}

export function throwError(scope: string, msg: string) {
  throw createMoeUIError(scope, msg)
}

export function debugWarn(error: Error): void
export function debugWarn(scope: string, msg: string): void
export function debugWarn(scope: string | Error, msg?: string) {
  if (!isProduction()) {
    const err = isString(scope) ? createMoeUIError(scope, msg ?? '') : scope
    console.warn(err)
  }
}

export function debugWarnOnce(scope: string, msg: string) {
  if (isProduction()) return

  const message = formatErrorMessage(scope, msg)
  if (warnedMessages.has(message)) return

  warnedMessages.add(message)
  console.warn(new MoeUIError(message))
}
