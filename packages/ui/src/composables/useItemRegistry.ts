import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowReactive,
  type ComputedRef,
  type Ref,
} from 'vue'

export interface RegisteredItem {
  value: () => string
  disabled: () => boolean
  el: () => HTMLElement | null | undefined
}

/**
 * A parent's registry of child items (radios, tabs) kept in DOM order, so
 * "first enabled item" stays right after keyed reorders and value changes.
 * DOM moves aren't reactive, so a MutationObserver on `root` re-sorts.
 */
export function useItemRegistry(root: Ref<HTMLElement | undefined>): {
  ordered: ComputedRef<RegisteredItem[]>
  register: (item: RegisteredItem) => () => void
} {
  const items = shallowReactive<RegisteredItem[]>([])
  const version = ref(0)
  let observer: MutationObserver | undefined

  onMounted(() => {
    version.value++
    if (root.value && typeof MutationObserver !== 'undefined') {
      observer = new MutationObserver(() => version.value++)
      observer.observe(root.value, { childList: true, subtree: true })
    }
  })
  onBeforeUnmount(() => observer?.disconnect())

  const ordered = computed(() => {
    void version.value
    return [...items].sort((a, b) => {
      const ea = a.el()
      const eb = b.el()
      if (!ea || !eb || ea === eb) return 0
      return ea.compareDocumentPosition(eb) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
    })
  })

  function register(item: RegisteredItem) {
    items.push(item)
    return () => {
      const i = items.indexOf(item)
      if (i !== -1) items.splice(i, 1)
    }
  }

  return { ordered, register }
}
