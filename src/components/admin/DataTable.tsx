import { ReactNode } from 'react'

interface Column<T> {
  key: string
  header: string
  render?: (item: T, index: number) => ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (item: T) => void
  emptyMessage?: string
  striped?: boolean
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  emptyMessage = 'Nenhum dado encontrado.',
  striped = false,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
      <table className="w-full min-w-[600px] text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {columns.map((col) => (
              <th
                key={col.key}
                className="whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-gray-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(item)}
                className={`
                  border-b border-gray-50 transition-colors last:border-0
                  ${onRowClick ? 'cursor-pointer' : ''}
                  ${striped && index % 2 === 1 ? 'bg-gray-50/50' : ''}
                  hover:bg-gray-50
                `}
              >
                {columns.map((col) => (
                  <td key={col.key} className="whitespace-nowrap px-6 py-4 text-gray-700">
                    {col.render
                      ? col.render(item, index)
                      : (item[col.key] as ReactNode) ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
