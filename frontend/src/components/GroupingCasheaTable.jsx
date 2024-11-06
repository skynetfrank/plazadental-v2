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

import MinusCircleIcon from "../icons/MinusCircleIcon";
import PlusCircleIcon from "../icons/PlusCircleIcon";

function GroupingCasheaTable({ data, columns, filterInput, botonera }) {
  const [grouping, setGrouping] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");
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
    <div className="flx column pad-0">
      {filterInput ? (
        <input
          className="b-radius border-1 pad-1 w-200"
          type="text"
          value={globalFilter}
          placeholder="Buscar"
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      ) : (
        ""
      )}

      <div>
        <table className="styled-table">
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
                              {row.getIsExpanded() ? <MinusCircleIcon /> : <PlusCircleIcon />}{" "}
                              {flexRender(cell.column.columnDef.cell, cell.getContext())} {row.subRows.length} ventas
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

        {botonera ? (
          <div className="botonera-reporte">
            <button className="minw-60" onClick={() => table.setPageIndex(0)}>
              primero
            </button>
            <button className="minw-60" onClick={() => table.previousPage()}>
              {"anterior"}
            </button>
            <button className="minw-60" onClick={() => table.nextPage()}>
              {"siguiente"}
            </button>
            <button className="minw-60" onClick={() => table.setPageIndex(table.getPageCount() - 1)}>
              Ultimo
            </button>
            <span className="pagination-totalpages">
              Pagina {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </span>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default GroupingCasheaTable;
