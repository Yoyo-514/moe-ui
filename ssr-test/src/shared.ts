import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import { createSSRApp, type Component } from 'vue'

import { renderToString } from '@vue/server-renderer'
import { globSync } from 'tinyglobby'

export interface SsrCase {
  name: string
  component: Component
  expects: string[]
}

export interface SsrCaseModule {
  default: SsrCase
}

export const testRoot = resolve(__dirname, '..')
export const projectRoot = resolve(testRoot, '..')
export const caseRoot = resolve(testRoot, 'cases')
export const casePaths = globSync('*.tsx', { cwd: caseRoot, absolute: true }).sort()

export const loadCase = async (casePath: string) => {
  const mod = (await import(pathToFileURL(casePath).href)) as SsrCaseModule
  return mod.default
}

export const renderCaseToString = (component: Component) => renderToString(createSSRApp(component))
