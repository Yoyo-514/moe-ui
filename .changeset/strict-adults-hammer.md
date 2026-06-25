---
'moe-cute-ui': patch
---

Align Checkbox and Radio public APIs with Element Plus semantics.

- Added Checkbox `checked`, `border`, `validate-event`, `tabindex`, and `aria-controls` props.
- Added Radio `border` and `validate-event` props.
- Added RadioGroup `id`, `aria-label`, and `validate-event` props.
- Removed CheckboxGroup `name` API from implementation and docs.
- Avoided duplicate Form validation triggers when Checkbox/Radio are used inside groups.
- Updated Checkbox and Radio docs to only document implemented public APIs.
- Added bordered examples and validate-event behavior tests.
