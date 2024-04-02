import type { CoreInstance, CoreOptions, CoreTableState } from './core/table'
import type {
  VisibilityColumn as ColumnVisibilityColumn,
  VisibilityColumnDef,
  VisibilityInstance,
  VisibilityOptions,
  VisibilityRow,
  VisibilityTableState,
} from './features/ColumnVisibility'
import type {
  ColumnOrderColumn,
  ColumnOrderInstance,
  ColumnOrderOptions,
  ColumnOrderTableState,
} from './features/ColumnOrdering'
import type {
  ColumnPinningColumn,
  ColumnPinningColumnDef,
  ColumnPinningInstance,
  ColumnPinningOptions,
  ColumnPinningRow,
  ColumnPinningTableState,
} from './features/ColumnPinning'
import type {
  RowPinningInstance,
  RowPinningOptions,
  RowPinningRow,
  RowPinningTableState,
} from './features/RowPinning'
import type {
  CoreHeader,
  CoreHeaderGroup,
  HeaderContext,
  HeadersInstance,
} from './core/headers'
import type { FacetedColumn, FacetedOptions } from './features/ColumnFaceting'
import type { GlobalFacetingInstance } from './features/GlobalFaceting'
import type {
  ColumnFiltersColumn,
  ColumnFiltersColumnDef,
  ColumnFiltersInstance,
  ColumnFiltersOptions,
  ColumnFiltersRow,
  ColumnFiltersTableState,
} from './features/ColumnFiltering'
import type {
  GlobalFilterColumn,
  GlobalFilterColumnDef,
  GlobalFilterInstance,
  GlobalFilterOptions,
  GlobalFilterTableState,
} from './features/GlobalFiltering'
import type {
  SortingColumn,
  SortingColumnDef,
  SortingInstance,
  SortingOptions,
  SortingTableState,
} from './features/RowSorting'
import type {
  GroupingCell,
  GroupingColumn,
  GroupingColumnDef,
  GroupingInstance,
  GroupingOptions,
  GroupingRow,
  GroupingTableState,
} from './features/ColumnGrouping'
import type {
  ExpandedInstance,
  ExpandedOptions,
  ExpandedRow,
  ExpandedTableState,
} from './features/RowExpanding'
import type {
  ColumnSizingColumn,
  ColumnSizingColumnDef,
  ColumnSizingHeader,
  ColumnSizingInstance,
  ColumnSizingOptions,
  ColumnSizingTableState,
} from './features/ColumnSizing'
import type {
  PaginationInitialTableState,
  PaginationInstance,
  PaginationOptions,
  PaginationTableState,
} from './features/RowPagination'
import type {
  RowSelectionInstance,
  RowSelectionOptions,
  RowSelectionRow,
  RowSelectionTableState,
} from './features/RowSelection'
import type { CoreRow } from './core/row'
import type { PartialKeys, UnionToIntersection } from './utils'
import type { CellContext, CoreCell } from './core/cell'
import type { CoreColumn } from './core/column'

export interface TableFeature<TData extends RowData = any> {
  createCell?: (
    cell: Cell<TData, unknown>,
    column: Column<TData>,
    row: Row<TData>,
    table: Table<TData>,
  ) => void
  createColumn?: (column: Column<TData, unknown>, table: Table<TData>) => void
  createHeader?: (header: Header<TData, unknown>, table: Table<TData>) => void
  createRow?: (row: Row<TData>, table: Table<TData>) => void
  createTable?: (table: Table<TData>) => void
  getDefaultColumnDef?: () => Partial<ColumnDef<TData, unknown>>
  getDefaultOptions?: (
    table: Table<TData>,
  ) => Partial<TableOptionsResolved<TData>>
  getInitialState?: (initialState?: InitialTableState) => Partial<TableState>
}

export interface TableMeta<TData extends RowData> {}

export interface ColumnMeta<TData extends RowData, TValue> {}

export interface FilterMeta {}

export interface FilterFns {}

export interface SortingFns {}

export interface AggregationFns {}

export type Updater<T> = T | ((old: T) => T)
export type OnChangeFn<T> = (updaterOrValue: Updater<T>) => void

export type RowData = unknown | object | Array<any>

export type AnyRender = (Comp: any, props: any) => any

export interface Table<TData extends RowData>
  extends CoreInstance<TData>,
    HeadersInstance<TData>,
    VisibilityInstance<TData>,
    ColumnOrderInstance<TData>,
    ColumnPinningInstance<TData>,
    RowPinningInstance<TData>,
    ColumnFiltersInstance<TData>,
    GlobalFilterInstance<TData>,
    GlobalFacetingInstance<TData>,
    SortingInstance<TData>,
    GroupingInstance<TData>,
    ColumnSizingInstance,
    ExpandedInstance<TData>,
    PaginationInstance<TData>,
    RowSelectionInstance<TData> {}

interface FeatureOptions<TData extends RowData>
  extends VisibilityOptions,
    ColumnOrderOptions,
    ColumnPinningOptions,
    RowPinningOptions<TData>,
    FacetedOptions<TData>,
    ColumnFiltersOptions<TData>,
    GlobalFilterOptions<TData>,
    SortingOptions<TData>,
    GroupingOptions,
    ExpandedOptions<TData>,
    ColumnSizingOptions,
    PaginationOptions,
    RowSelectionOptions<TData> {}

export interface TableOptionsResolved<TData extends RowData>
  extends CoreOptions<TData>,
    FeatureOptions<TData> {}

export interface TableOptions<TData extends RowData>
  extends PartialKeys<
    TableOptionsResolved<TData>,
    'state' | 'onStateChange' | 'renderFallbackValue'
  > {}

export interface TableState
  extends CoreTableState,
    VisibilityTableState,
    ColumnOrderTableState,
    ColumnPinningTableState,
    RowPinningTableState,
    ColumnFiltersTableState,
    GlobalFilterTableState,
    SortingTableState,
    ExpandedTableState,
    GroupingTableState,
    ColumnSizingTableState,
    PaginationTableState,
    RowSelectionTableState {}

interface CompleteInitialTableState
  extends CoreTableState,
    VisibilityTableState,
    ColumnOrderTableState,
    ColumnPinningTableState,
    RowPinningTableState,
    ColumnFiltersTableState,
    GlobalFilterTableState,
    SortingTableState,
    ExpandedTableState,
    GroupingTableState,
    ColumnSizingTableState,
    PaginationInitialTableState,
    RowSelectionTableState {}

export interface InitialTableState extends Partial<CompleteInitialTableState> {}

export interface Row<TData extends RowData>
  extends CoreRow<TData>,
    VisibilityRow<TData>,
    ColumnPinningRow<TData>,
    RowPinningRow,
    ColumnFiltersRow<TData>,
    GroupingRow,
    RowSelectionRow,
    ExpandedRow {}

export interface RowModel<TData extends RowData> {
  rows: Array<Row<TData>>
  flatRows: Array<Row<TData>>
  rowsById: Record<string, Row<TData>>
}

export type AccessorFn<TData extends RowData, TValue = unknown> = (
  originalRow: TData,
  index: number,
) => TValue

export type ColumnDefTemplate<TProps extends object> =
  | string
  | ((props: TProps) => any)

export type StringOrTemplateHeader<TData, TValue> =
  | string
  | ColumnDefTemplate<HeaderContext<TData, TValue>>

export interface StringHeaderIdentifier {
  header: string
  id?: string
}

export interface IdIdentifier<TData extends RowData, TValue> {
  id: string
  header?: StringOrTemplateHeader<TData, TValue>
}

type ColumnIdentifiers<TData extends RowData, TValue> =
  | IdIdentifier<TData, TValue>
  | StringHeaderIdentifier

//

interface ColumnDefExtensions<TData extends RowData, TValue = unknown>
  extends VisibilityColumnDef,
    ColumnPinningColumnDef,
    ColumnFiltersColumnDef<TData>,
    GlobalFilterColumnDef,
    SortingColumnDef<TData>,
    GroupingColumnDef<TData, TValue>,
    ColumnSizingColumnDef {}

export interface ColumnDefBase<TData extends RowData, TValue = unknown>
  extends ColumnDefExtensions<TData, TValue> {
  getUniqueValues?: AccessorFn<TData, Array<unknown>>
  footer?: ColumnDefTemplate<HeaderContext<TData, TValue>>
  cell?: ColumnDefTemplate<CellContext<TData, TValue>>
  meta?: ColumnMeta<TData, TValue>
}

//

export interface IdentifiedColumnDef<TData extends RowData, TValue = unknown>
  extends ColumnDefBase<TData, TValue> {
  id?: string
  header?: StringOrTemplateHeader<TData, TValue>
}

export type DisplayColumnDef<
  TData extends RowData,
  TValue = unknown,
> = ColumnDefBase<TData, TValue> & ColumnIdentifiers<TData, TValue>

interface GroupColumnDefBase<TData extends RowData, TValue = unknown>
  extends ColumnDefBase<TData, TValue> {
  columns?: Array<ColumnDef<TData, any>>
}

export type GroupColumnDef<
  TData extends RowData,
  TValue = unknown,
> = GroupColumnDefBase<TData, TValue> & ColumnIdentifiers<TData, TValue>

export interface AccessorFnColumnDefBase<
  TData extends RowData,
  TValue = unknown,
> extends ColumnDefBase<TData, TValue> {
  accessorFn: AccessorFn<TData, TValue>
}

export type AccessorFnColumnDef<
  TData extends RowData,
  TValue = unknown,
> = AccessorFnColumnDefBase<TData, TValue> & ColumnIdentifiers<TData, TValue>

export interface AccessorKeyColumnDefBase<
  TData extends RowData,
  TValue = unknown,
> extends ColumnDefBase<TData, TValue> {
  id?: string
  accessorKey: (string & {}) | keyof TData
}

export type AccessorKeyColumnDef<
  TData extends RowData,
  TValue = unknown,
> = AccessorKeyColumnDefBase<TData, TValue> &
  Partial<ColumnIdentifiers<TData, TValue>>

export type AccessorColumnDef<TData extends RowData, TValue = unknown> =
  | AccessorKeyColumnDef<TData, TValue>
  | AccessorFnColumnDef<TData, TValue>

//

export type ColumnDef<TData extends RowData, TValue = unknown> =
  | DisplayColumnDef<TData, TValue>
  | GroupColumnDef<TData, TValue>
  | AccessorColumnDef<TData, TValue>

export type ColumnDefResolved<
  TData extends RowData,
  TValue = unknown,
> = Partial<UnionToIntersection<ColumnDef<TData, TValue>>> & {
  accessorKey?: string
}

export interface Column<TData extends RowData, TValue = unknown>
  extends CoreColumn<TData, TValue>,
    ColumnVisibilityColumn,
    ColumnPinningColumn,
    FacetedColumn<TData>,
    ColumnFiltersColumn<TData>,
    GlobalFilterColumn,
    SortingColumn<TData>,
    GroupingColumn<TData>,
    ColumnSizingColumn,
    ColumnOrderColumn {}

export interface Cell<TData extends RowData, TValue>
  extends CoreCell<TData, TValue>,
    GroupingCell {}

export interface Header<TData extends RowData, TValue>
  extends CoreHeader<TData, TValue>,
    ColumnSizingHeader {}

export interface HeaderGroup<TData extends RowData>
  extends CoreHeaderGroup<TData> {}
