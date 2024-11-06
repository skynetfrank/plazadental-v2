import React, { useState } from "react";
import {
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getCoreRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  flexRender,
  getSortedRowModel,
} from "@tanstack/react-table";

function GroupingProductosTable({ data, columns }) {
  const [grouping, setGrouping] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });

  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      grouping,
      sorting,
      pagination,
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onGroupingChange: setGrouping,
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
  });

  return (
    <div className="tankstack-table-container">
      <div className="filterv8-container">
        <input
          type="text"
          className="filter-input-v8"
          value={globalFilter}
          placeholder="Buscar"
          onChange={(e) => setGlobalFilter(e.target.value)}
        />

        <span className="pagination-totalpages">
          Pagina {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </span>
      </div>

      <div>
        <table id="consolidado-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div className="tankstack-th-container">
                          {header.column.getCanGroup() ? (
                            // If the header can be grouped, let's add a toggle
                            <button
                              {...{
                                onClick: header.column.getToggleGroupingHandler(),
                                style: {
                                  cursor: "pointer",
                                },
                              }}
                              className={header.column.getIsGrouped() ? "th-ungroup-btn" : "th-group-btn"}
                            >
                              {header.column.getIsGrouped() ? `🛑` : ``}
                            </button>
                          ) : null}{" "}
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell, inx) => {
                    return (
                      <td
                        key={inx}
                        {...{
                          key: cell.id,
                          style: {
                            background: cell.getIsGrouped()
                              ? "#dedede"
                              : cell.getIsAggregated()
                              ? "#bebdbd"
                              : cell.getIsPlaceholder()
                              ? "#bebdbd"
                              : "white",
                          },
                        }}
                      >
                        {cell.getIsGrouped() ? (
                          // If it's a grouped cell, add an expander and row count
                          <>
                            <button
                              {...{
                                onClick: row.getToggleExpandedHandler(),
                                style: {
                                  cursor: row.getCanExpand() ? "pointer" : "normal",
                                },
                              }}
                              className="td-group-btn"
                            >
                              {row.getIsExpanded() ? <button /> : <button />}{" "}
                              {flexRender(cell.column.columnDef.cell, cell.getContext())} Items: {row.subRows.length}
                            </button>
                          </>
                        ) : cell.getIsAggregated() ? (
                          // If the cell is aggregated, use the Aggregated
                          // renderer for cell
                          flexRender(
                            cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell,
                            cell.getContext()
                          )
                        ) : cell.getIsPlaceholder() ? null : ( // For cells with repeated values, render null
                          // Otherwise, just render the regular cell
                          flexRender(cell.column.columnDef.cell, cell.getContext())
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((footer) => (
                  <th key={footer.id}>{flexRender(footer.column.columnDef.footer, footer.getContext())}</th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>

        <div className="tankstack-pagination-container">
          <div className="tankstack-pagination-botonera">
            <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
              {"primero"}
            </button>
            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              {"anterior"}
            </button>
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              {"siguiente"}
            </button>
            <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
              {"ultimo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupingProductosTable;
