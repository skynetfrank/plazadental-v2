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
import CogIcon from "../icons/CogIcon";

function GroupingCuadreTableV2({ data, columns }) {
  const [grouping, setGrouping] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 100 });

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
    <div>
      <div>
        <table id="tabla-cuadre" className="styled-table m-0">
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
                              {header.column.getIsGrouped() ? `🛑` : <CogIcon className="td-group-icon" />}
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
                            fontWeight: cell.getIsAggregated() ? "bold" : "normal",
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
                              {row.getIsExpanded() ? (
                                <MinusCircleIcon className="td-group-icon" />
                              ) : (
                                <PlusCircleIcon className="td-group-icon" />
                              )}{" "}
                              {flexRender(cell.column.columnDef.cell, cell.getContext())} ({row.subRows.length})
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
      </div>
    </div>
  );
}

export default GroupingCuadreTableV2;
