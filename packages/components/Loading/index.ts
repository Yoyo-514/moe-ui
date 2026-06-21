import { service } from './method'
import { loadingDirective } from './directive'
import './style.scss'
import type { LoadingService } from './types'
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
export * from './types'
