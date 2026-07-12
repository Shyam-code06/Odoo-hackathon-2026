import { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { Checkbox } from './Checkbox';
import { TableSkeleton } from './Loader';
import { EmptyState } from './EmptyState';
import { cn } from '@/utils';

/**
 * Reusable Data Table Component
 */
export function Table({
  columns = [], // [{ key: '...', header: '...', sortable: true, align: 'left'|'right'|'center', render: (row) => ReactNode }]
  data = [],
  isLoading = false,
  emptyTitle = 'No records found',
  emptyDescription = 'There are no items recorded in this directory.',
  emptyIcon,
  stickyHeader = false,
  selectable = false,
  selectedRowIds = [], // Array of string IDs
  onSelectRowIds, // (ids) => void
  sortKey,
  sortDirection, // 'asc' | 'desc'
  onSort, // (key) => void
  pagination, // { page: 1, totalPages: 10, totalCount: 100, onPageChange: (page) => void, rowsPerPage: 10, onRowsPerPageChange: (num) => void }
  bulkActions = [], // [{ label: 'Delete', variant: 'danger', onClick: (selectedIds) => void }]
  className,
}) {
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const allRowIds = data.map((row) => row.id || row._id);
  const isAllSelected = allRowIds.length > 0 && allRowIds.every((id) => selectedRowIds.includes(id));
  const isSomeSelected = allRowIds.length > 0 && allRowIds.some((id) => selectedRowIds.includes(id)) && !isAllSelected;

  const handleSelectAll = (checked) => {
    if (!onSelectRowIds) return;
    if (checked) {
      // Add all visible rows to selected list
      const uniqueIds = Array.from(new Set([...selectedRowIds, ...allRowIds]));
      onSelectRowIds(uniqueIds);
    } else {
      // Remove all visible rows from selected list
      const filtered = selectedRowIds.filter((id) => !allRowIds.includes(id));
      onSelectRowIds(filtered);
    }
  };

  const handleSelectRow = (rowId, checked) => {
    if (!onSelectRowIds) return;
    if (checked) {
      onSelectRowIds([...selectedRowIds, rowId]);
    } else {
      onSelectRowIds(selectedRowIds.filter((id) => id !== rowId));
    }
  };

  const handleSortClick = (key) => {
    if (onSort) onSort(key);
  };

  // 1. Loading State
  if (isLoading) {
    return <TableSkeleton rows={5} cols={columns.length + (selectable ? 1 : 0)} />;
  }

  // 2. Empty State
  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={emptyIcon || AlertCircle}
      />
    );
  }

  return (
    <div
      className={cn(
        "w-full bg-white border border-slate-200/80 rounded-2xl shadow-premium overflow-visible select-none",
        className,
      )}
    >
      {/* Dynamic Bulk Actions Drawer */}
      {selectable && selectedRowIds.length > 0 && bulkActions.length > 0 && (
        <div className="flex items-center justify-between px-6 py-3 bg-brand-bg-secondary border-b border-subtle text-xs font-semibold text-slate-700 animate-slide-in ">
          <span>{selectedRowIds.length} row(s) selected</span>
          <div className="flex items-center gap-2">
            {bulkActions.map((action, index) => (
              <button
                key={index}
                type="button"
                onClick={() => action.onClick(selectedRowIds)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer",
                  action.variant === "danger"
                    ? "bg-brand-danger/10 text-brand-danger hover:bg-brand-danger hover:text-white"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50",
                )}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Scrollable responsive table shell */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Header */}
          <thead
            className={cn(
              "bg-slate-50 border-b border-subtle text-[10px] font-bold text-slate-450 uppercase tracking-wider select-none",
              stickyHeader && "sticky top-0 z-10",
            )}
          >
            <tr>
              {selectable && (
                <th className="px-6 py-4 w-12 text-center">
                  <Checkbox
                    checked={isAllSelected}
                    error={isSomeSelected}
                    onChange={handleSelectAll}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((col) => {
                const alignStyles = {
                  left: "text-left",
                  right: "text-right",
                  center: "text-center",
                };
                const isSortedCol = sortKey === col.key;

                return (
                  <th
                    key={col.key}
                    onClick={
                      col.sortable ? () => handleSortClick(col.key) : undefined
                    }
                    className={cn(
                      "px-6 py-4 font-bold select-none",
                      alignStyles[col.align || "left"],
                      col.sortable &&
                        "cursor-pointer hover:text-slate-800 transition-colors",
                    )}
                  >
                    <div className="inline-flex items-center gap-1">
                      <span>{col.header}</span>
                      {col.sortable && (
                        <div className="flex flex-col text-slate-350">
                          <ChevronUp
                            className={cn(
                              "w-3 h-3 -mb-1",
                              isSortedCol &&
                                sortDirection === "asc" &&
                                "text-brand-primary",
                            )}
                          />
                          <ChevronDown
                            className={cn(
                              "w-3 h-3",
                              isSortedCol &&
                                sortDirection === "desc" &&
                                "text-brand-primary",
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-subtle text-xs text-slate-655 font-medium overflow-y-visible">
            {data.map((row, index) => {
              const rowId = row.id || row._id || index;
              const isSelected = selectedRowIds.includes(rowId);

              return (
                <tr
                  key={rowId}
                  className={cn(
                    "hover:bg-slate-50/50 transition-colors duration-150",
                    isSelected && "bg-blue-50/15",
                  )}
                >
                  {selectable && (
                    <td className="px-6 py-3.5 text-center">
                      <Checkbox
                        checked={isSelected}
                        onChange={(checked) => handleSelectRow(rowId, checked)}
                        aria-label={`Select row ${index + 1}`}
                      />
                    </td>
                  )}
                  {columns.map((col) => {
                    const alignStyles = {
                      left: "text-left",
                      right: "text-right",
                      center: "text-center",
                    };
                    return (
                      <td
                        key={col.key}
                        className={cn(
                          "px-6 py-3.5",
                          col.key === 'actions' ? "overflow-visible" : "truncate",
                          alignStyles[col.align || "left"],
                        )}
                      >
                        {col.render ? col.render(row) : (row[col.key] ?? "-")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {pagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-subtle select-none text-[11px] font-semibold text-slate-450 bg-slate-50/50">
          {/* Rows Per Page Indicator */}
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={pagination.rowsPerPage || rowsPerPage}
              onChange={(e) => {
                const val = Number(e.target.value);
                setRowsPerPage(val);
                if (pagination.onRowsPerPageChange) {
                  pagination.onRowsPerPageChange(val);
                }
              }}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:border-brand-primary"
            >
              {[5, 10, 25, 50].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* Current Page Tracker */}
          <div className="flex items-center gap-4">
            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => pagination.onPageChange(pagination.page - 1)}
                className="p-1 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4 text-slate-500" />
              </button>
              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => pagination.onPageChange(pagination.page + 1)}
                className="p-1 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
