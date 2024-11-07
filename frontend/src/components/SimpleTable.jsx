import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

import { useState } from "react";

function SimpleTable({ data, columns, filterInput, botonera, records }) {
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter: filtering,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
    onPaginationChange: setPagination,
  });

  return (
    <div className="flx column pad-0">
      {filterInput ? (
        <input
          className="b-radius border-1 pad-1 w-200"
          type="text"
          value={filtering}
          placeholder={"Buscar en " + records + " pacientes"}
          onChange={(e) => setFiltering(e.target.value)}
        />
      ) : (
        ""
      )}

      <table className="styled-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                  {header.isPlaceholder ? null : (
                    <div>
                      {flexRender(header.column.columnDef.header, header.getContext())}

                      {{ asc: "⬆️", desc: "⬇️" }[header.column.getIsSorted() ?? null]}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell, inx) => (
                <td key={inx}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
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
  );
}

export default SimpleTable;
