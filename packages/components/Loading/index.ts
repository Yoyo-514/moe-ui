import { service } from './src/method'
import { loadingDirective } from './src/directive'
import './style/index.scss'
import type { LoadingService } from './src/types'
import type { App } from 'vue'

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
