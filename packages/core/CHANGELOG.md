# moe-cute-ui

## 0.2.1

### Patch Changes

- 5020f70: Align Checkbox and Radio public APIs with Element Plus semantics.

  - Added Checkbox `checked`, `border`, `validate-event`, `tabindex`, and `aria-controls` props.
  - Added Radio `border` and `validate-event` props.
  - Added RadioGroup `id`, `aria-label`, and `validate-event` props.
  - Removed CheckboxGroup `name` API from implementation and docs.
  - Avoided duplicate Form validation triggers when Checkbox/Radio are used inside groups.
  - Updated Checkbox and Radio docs to only document implemented public APIs.
  - Added bordered examples and validate-event behavior tests.

## 0.2.0

### Minor Changes

- a9b65fe: Prepare the first usable component-library release.

  - Add core Vue 3 components, feedback components, form controls and ConfigProvider.
  - Add ES, UMD, type declaration and component style builds.
  - Add manual and automatic on-demand imports with a unified `MoeUIResolver`.
  - Add VitePress documentation, Vitest coverage and release workflow support.
