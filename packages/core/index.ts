import installer from './defaults'

export * from '@moe-ui/components'
export * from '@moe-ui/hooks'
export {
  en,
  zhCn,
  translate as translateLocale,
  type Language,
  type TranslatePair,
  type TranslateValues,
} from '@moe-ui/locale'
export * from './make-installer'

export const install = installer.install

export default installer
