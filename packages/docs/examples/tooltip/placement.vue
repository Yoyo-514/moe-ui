<script setup lang="ts">
import type { Options } from '@popperjs/core'

const placementPopperOptions: Partial<Options> = {
  modifiers: [
    {
      name: 'flip',
      enabled: false,
    },
  ],
}
</script>

<template>
  <div class="tooltip-placement-demo">
    <div></div>
    <div class="tooltip-placement-demo__row">
      <moe-tooltip
        content="top-start"
        placement="top-start"
        :popper-options="placementPopperOptions"
      >
        <moe-button>top-start</moe-button>
      </moe-tooltip>
      <moe-tooltip content="top" placement="top" :popper-options="placementPopperOptions">
        <moe-button>top</moe-button>
      </moe-tooltip>
      <moe-tooltip content="top-end" placement="top-end" :popper-options="placementPopperOptions">
        <moe-button>top-end</moe-button>
      </moe-tooltip>
    </div>
    <div></div>

    <div class="tooltip-placement-demo__side">
      <moe-tooltip
        content="left-start"
        placement="left-start"
        :popper-options="placementPopperOptions"
      >
        <moe-button>left-start</moe-button>
      </moe-tooltip>
      <moe-tooltip content="left" placement="left" :popper-options="placementPopperOptions">
        <moe-button>left</moe-button>
      </moe-tooltip>
      <moe-tooltip content="left-end" placement="left-end" :popper-options="placementPopperOptions">
        <moe-button>left-end</moe-button>
      </moe-tooltip>
    </div>

    <div class="tooltip-placement-demo__center">Placement</div>

    <div class="tooltip-placement-demo__side">
      <moe-tooltip
        content="right-start"
        placement="right-start"
        :popper-options="placementPopperOptions"
      >
        <moe-button>right-start</moe-button>
      </moe-tooltip>
      <moe-tooltip content="right" placement="right" :popper-options="placementPopperOptions">
        <moe-button>right</moe-button>
      </moe-tooltip>
      <moe-tooltip
        content="right-end"
        placement="right-end"
        :popper-options="placementPopperOptions"
      >
        <moe-button>right-end</moe-button>
      </moe-tooltip>
    </div>

    <div></div>
    <div class="tooltip-placement-demo__row">
      <moe-tooltip
        content="bottom-start"
        placement="bottom-start"
        :popper-options="placementPopperOptions"
      >
        <moe-button>bottom-start</moe-button>
      </moe-tooltip>
      <moe-tooltip content="bottom" placement="bottom" :popper-options="placementPopperOptions">
        <moe-button>bottom</moe-button>
      </moe-tooltip>
      <moe-tooltip
        content="bottom-end"
        placement="bottom-end"
        :popper-options="placementPopperOptions"
      >
        <moe-button>bottom-end</moe-button>
      </moe-tooltip>
    </div>
    <div></div>
  </div>
</template>

<style scoped>
.tooltip-placement-demo {
  display: grid;
  grid-template-columns: 120px minmax(240px, auto) 180px;
  gap: 18px 40px;
  align-items: center;
  justify-content: center;
  overflow: auto;
}

.tooltip-placement-demo__row {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.tooltip-placement-demo__side {
  display: grid;
  gap: 12px;
  justify-items: center;
}

.tooltip-placement-demo__center {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 96px;
  border: 1px dashed var(--moe-border-color);
  border-radius: var(--moe-border-radius-base);
  color: var(--moe-text-color-secondary);
  background: var(--moe-fill-color-light);
}

@media (max-width: 720px) {
  .tooltip-placement-demo {
    grid-template-columns: 1fr;
  }
}
</style>
