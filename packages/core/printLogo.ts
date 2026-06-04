const DEV_MESSAGE = 'MoeCuteUI is running in development mode. Stay cute and keep building!'

let isLogoPrinted = false

function printProdLogo() {
  globalThis.console?.info(`${String.raw`
 __  __             ____      _        _   _ ___
|  \/  | ___   ___ / ___|   _| |_ ___ | | | |_ _|
| |\/| |/ _ \ / _ \ |  | | | | __/ _ \| | | || |
| |  | | (_) |  __/ |__| |_| | ||  __/| |_| || |
|_|  |_|\___/ \___|\____\__,_|\__\___| \___/|___|
`}
MoeCuteUI is ready.`)
}

export function printLogo() {
  if (isLogoPrinted) return

  isLogoPrinted = true

  if (PROD) {
    printProdLogo()
    return
  }

  if (DEV) {
    globalThis.console?.info(`[MoeCuteUI:development] ${DEV_MESSAGE}`)
    return
  }

  if (TEST) {
    globalThis.console?.info('[MoeCuteUI:test] MoeCuteUI is running in test mode.')
  }
}
