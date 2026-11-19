import { expect } from 'vitest'
import * as matchers from 'vitest-axe/matchers'

expect.extend(matchers)

// jsdom lacks pointer capture and scrollIntoView, which Reka's Select calls.
Element.prototype.hasPointerCapture ??= () => false
Element.prototype.releasePointerCapture ??= () => {}
Element.prototype.scrollIntoView ??= () => {}

// jsdom lacks ResizeObserver, which Reka UI's positioning (floating-ui) uses.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// jsdom has no canvas; axe's color-contrast probe calls getContext and jsdom
// logs a "Not implemented" error. Contrast is verified on tokens instead
// (packages/tokens) and in Storybook's real browser via addon-a11y.
HTMLCanvasElement.prototype.getContext = (() =>
  null) as typeof HTMLCanvasElement.prototype.getContext
