import React from "react";
import { useExpanded, useGroupBy, useSortBy, useGlobalFilter, useTable } from "react-table";
import { GlobalFilter } from "./GlobalFilter";

function ReportTable({ columns, data, agrupador }) {
  const { getTableProps, getTableBodyProps, headerGroups, footerGroups, rows, prepareRow, state, setGlobalFilter } =
    useTable({ columns, data }, useGlobalFilter, useGroupBy, useSortBy, useExpanded);

  const { globalFilter } = state;

  return (
    <>
      <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
      <table className="table-react" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, ihg) => (
            <tr key={ihg} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, ic) => (
                <th key={ihg} {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.canGroupBy && column.id === agrupador.fecha ? (
                    <span {...column.getGroupByToggleProps()}> {column.isGrouped ? "+ " : "- "}</span>
                  ) : null}

                  {column.render("Header")}
                  <span>{column.isSorted ? (column.isSortedDesc ? " ▼" : " ▲") : ""}</span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, ir) => {
            prepareRow(row);
            return (
              <tr key={ir} {...row.getRowProps()}>
                {row.cells.map((cell, icell) => {
                  return (
                    <td
                      key={icell}
                      {...cell.getCellProps({
                        className: cell.column.className,
                      })}
                    >
                      {cell.isGrouped ? (
                        // If it's a grouped cell, add an expander and row count
                        <>
                          <span {...row.getToggleRowExpandedProps()}>{row.isExpanded ? "-" : "+"}</span>{" "}
                          {cell.render("Cell")} ({row.subRows.length})
                        </>
                      ) : cell.isAggregated ? (
                        // If the cell is aggregated, use the Aggregated
                        // renderer for cell
                        cell.render("Aggregated")
                      ) : cell.isPlaceholder ? null : ( // For cells with repeated values, render null
                        // Otherwise, just render the regular cell
                        cell.render("Cell")
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          {footerGroups.map((footerGroup, ifg) => (
            <tr key={ifg} {...footerGroup.getHeaderGroupProps()}>
              {footerGroup.headers.map((column, ifh) => (
                <td key={ifh} {...column.getFooterProps}>
                  {column.render("Footer")}
                </td>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </>
  );
}

export default ReportTable;
