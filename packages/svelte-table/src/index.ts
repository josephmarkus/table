import { createTable } from '@tanstack/table-core'
import { SvelteComponent } from 'svelte/internal'
import { derived, get, readable, writable } from 'svelte/store'
import Placeholder from './placeholder'
import { renderComponent } from './render-component'
import type { Readable } from 'svelte/store'
import type { ComponentType } from 'svelte'
import type {
  RowData,
  TableOptions,
  TableOptionsResolved,
} from '@tanstack/table-core'

export { renderComponent } from './render-component'

export * from '@tanstack/table-core'

function isSvelteServerComponent(component: any) {
  return (
    typeof component === 'object' &&
    typeof component.$$render === 'function' &&
    typeof component.render === 'function'
  )
}

function isSvelteClientComponent(component: any) {
  const isHMR = '__SVELTE_HMR' in window

  return (
    component.prototype instanceof SvelteComponent ||
    (isHMR &&
      component.name?.startsWith('Proxy<') &&
      component.name?.endsWith('>'))
  )
}

function isSvelteComponent(component: any) {
  if (typeof document === 'undefined') {
    return isSvelteServerComponent(component)
  } else {
    return isSvelteClientComponent(component)
  }
}

function wrapInPlaceholder(content: any) {
  return renderComponent(Placeholder, { content })
}

export function flexRender(component: any, props: any): ComponentType | null {
  if (!component) return null

  if (isSvelteComponent(component)) {
    return renderComponent(component, props)
  }

  if (typeof component === 'function') {
    const result = component(props)
    if (result === null || result === undefined) return null

    if (isSvelteComponent(result)) {
      return renderComponent(result, props)
    }

    return wrapInPlaceholder(result)
  }

  return wrapInPlaceholder(component)
}

type ReadableOrVal<T> = T | Readable<T>

export function createSvelteTable<TData extends RowData>(
  options: ReadableOrVal<TableOptions<TData>>,
) {
  let optionsStore: Readable<TableOptions<TData>>

  if ('subscribe' in options) {
    optionsStore = options
  } else {
    optionsStore = readable(options)
  }

  const resolvedOptions: TableOptionsResolved<TData> = {
    state: {}, // Dummy state
    onStateChange: () => {}, // noop
    renderFallbackValue: null,
    ...get(optionsStore),
  }

  const table = createTable(resolvedOptions)

  const stateStore = writable(/** @type {number} */ table.initialState)
  // combine stores
  const stateOptionsStore = derived([stateStore, optionsStore], (s) => s)
  const tableReadable = readable(table, function start(set) {
    const unsubscribe = stateOptionsStore.subscribe(([state, options]) => {
      table.setOptions((prev) => {
        return {
          ...prev,
          ...options,
          state: { ...state, ...options.state },
          // Similarly, we'll maintain both our internal state and any user-provided
          // state.
          onStateChange: (updater) => {
            if (updater instanceof Function) {
              stateStore.update(updater)
            } else {
              stateStore.set(updater)
            }

            resolvedOptions.onStateChange(updater)
          },
        }
      })

      // it didn't seem to rerender without setting the table
      set(table)
    })

    return function stop() {
      unsubscribe()
    }
  })

  return tableReadable
}
