import type { App } from 'vue'

import { loadingDirective } from './src/directive'
import { service } from './src/method'

import type { LoadingService } from './src/types'

export const MoeLoading: LoadingService = {
  service,
  directive: loadingDirective,
  install(app: App) {
    app.directive('loading', loadingDirective)
    app.config.globalProperties.$loading = service
  },
}

export { service as LoadingService, loadingDirective }
export * from './src/types'
