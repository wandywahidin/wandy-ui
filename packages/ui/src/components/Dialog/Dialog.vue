<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'reka-ui'
import { useUi } from '../../composables/useUi'
import type { UiOverrides } from '../../types'
import IconButton from '../Button/IconButton.vue'
import { dialogVariants } from './Dialog.variants'

defineOptions({ inheritAttrs: false })

type DialogSlot =
  'overlay' | 'content' | 'header' | 'title' | 'description' | 'body' | 'footer' | 'close'

export interface DialogProps {
  /** Accessible name of the dialog, shown as its heading. */
  title: string
  description?: string
  /** Accessible name of the close button. */
  closeLabel?: string
  size?: 'sm' | 'md' | 'lg'
  ui?: UiOverrides<DialogSlot>
}

const props = withDefaults(defineProps<DialogProps>(), { closeLabel: 'Close', size: 'md' })
const open = defineModel<boolean>('open', { default: false })
const slots = defineSlots<{ trigger?(): unknown; default?(): unknown; footer?(): unknown }>()

const attrs = useAttrs()
// Reka links aria-describedby to DialogDescription; without one, opt out
// explicitly so the attribute never points at a missing element. A consumer's
// own aria-describedby (pointing at their element) is kept.
const noDescription = computed(() =>
  props.description ? {} : { 'aria-describedby': attrs['aria-describedby'] as string | undefined },
)

// `class` and other attrs go to the content panel (the dialog element).
const classes = useUi<DialogSlot>(
  'dialog',
  () => {
    const s = dialogVariants({ size: props.size })
    return {
      overlay: s.overlay(),
      content: s.content(),
      header: s.header(),
      title: s.title(),
      description: s.description(),
      body: s.body(),
      footer: s.footer(),
      close: s.close(),
    }
  },
  { ui: () => props.ui, class: () => attrs.class, root: 'content' },
)
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger v-if="slots.trigger" as-child><slot name="trigger" /></DialogTrigger>
    <DialogPortal>
      <DialogOverlay :class="classes.overlay" />
      <DialogContent
        v-bind="{ ...attrs, class: undefined, ...noDescription }"
        :class="classes.content"
      >
        <div :class="classes.header">
          <div>
            <DialogTitle :class="classes.title">{{ title }}</DialogTitle>
            <DialogDescription v-if="description" :class="classes.description">
              {{ description }}
            </DialogDescription>
          </div>
          <DialogClose as-child>
            <IconButton :label="closeLabel" size="sm" :class="classes.close">
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </IconButton>
          </DialogClose>
        </div>
        <div v-if="slots.default" :class="classes.body"><slot /></div>
        <div v-if="slots.footer" :class="classes.footer"><slot name="footer" /></div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
