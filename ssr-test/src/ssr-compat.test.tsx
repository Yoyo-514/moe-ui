/* eslint-disable vue/one-component-per-file */
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import { createSSRApp, defineComponent, h } from 'vue'

import { renderToString } from '@vue/server-renderer'
import { describe, expect, it } from 'vitest'

import {
  MoeAlert,
  MoeButton,
  MoeButtonGroup,
  MoeCollapse,
  MoeCollapseItem,
  MoeConfigProvider,
  MoeDropdown,
  MoeDropdownItem,
  MoeDropdownMenu,
  MoeForm,
  MoeFormItem,
  MoeInput,
  MoeLoading,
  MoeMessage,
  MoeMessageBox,
  MoeNotification,
  MoeOption,
  MoePopconfirm,
  MoeSelect,
  MoeSwitch,
  MoeTooltip,
} from '@moe-ui/components'

import { casePaths, loadCase, projectRoot, renderCaseToString } from './shared'

describe('Moe UI SSR compatibility', () => {
  it('discovers SSR cases efficiently from ssr-test/cases', () => {
    expect(casePaths.length).toBeGreaterThan(0)
  })

  it.each(casePaths)('renders case %s to string in node environment', async (casePath) => {
    expect(globalThis.document).toBeUndefined()

    const ssrCase = await loadCase(casePath)
    const html = await renderCaseToString(ssrCase.component)

    for (const expected of ssrCase.expects) {
      expect(html).toContain(expected)
    }
  })

  it('installs source components on an SSR app without touching browser globals', async () => {
    const App = defineComponent({
      setup() {
        return () => h(MoeButton, null, () => 'Installed Button')
      },
    })
    const app = createSSRApp(App)

    app.use(MoeButton)
    app.use(MoeButtonGroup)
    app.use(MoeAlert)
    app.use(MoeCollapse)
    app.use(MoeCollapseItem)
    app.use(MoeConfigProvider)
    app.use(MoeForm)
    app.use(MoeFormItem)
    app.use(MoeInput)
    app.use(MoeSelect)
    app.use(MoeOption)
    app.use(MoeSwitch)
    app.use(MoeTooltip)
    app.use(MoePopconfirm)
    app.use(MoeDropdown)
    app.use(MoeDropdownMenu)
    app.use(MoeDropdownItem)
    app.use(MoeLoading)

    await expect(renderToString(app)).resolves.toContain('Installed Button')
    expect(globalThis.document).toBeUndefined()
  })

  it('renders built dist installer and component exports in node environment', async () => {
    expect(globalThis.document).toBeUndefined()

    const distEntry = resolve(projectRoot, 'packages/core/dist/es/index.mjs')
    const dist = (await import(
      pathToFileURL(distEntry).href
    )) as typeof import('../../packages/core')
    const App = defineComponent({
      setup() {
        return () => h(dist.MoeButton, { type: 'primary' }, () => 'Built Dist Button')
      },
    })
    const app = createSSRApp(App)

    app.use(dist.default)

    await expect(renderToString(app)).resolves.toContain('Built Dist Button')
  })

  it('keeps command services safe when document is unavailable', async () => {
    expect(globalThis.document).toBeUndefined()

    const loading = MoeLoading.service({ text: 'loading on server' })
    const message = MoeMessage('message on server')
    const notification = MoeNotification('notification on server')

    expect(() => loading.close()).not.toThrow()
    expect(() => message.close()).not.toThrow()
    expect(() => notification.close()).not.toThrow()
    await expect(MoeMessageBox('message box on server')).rejects.toBe('close')
  })
})
