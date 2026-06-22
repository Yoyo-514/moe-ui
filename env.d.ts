/// <reference types="vite/client" />

declare const PROD: boolean
declare const DEV: boolean
declare const TEST: boolean

declare module '*.png' {
  const src: string
  export default src
}
declare module '*.jpg'
declare module '*.svg'

declare module '*.css'
declare module '*.scss'
