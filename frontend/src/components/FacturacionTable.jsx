import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

import { useEffect, useState } from "react";
import CloseIcon from "../icons/CloseIcon";

function FacturacionTable({ data, columns, clearinput }) {
  const [filtering, setFiltering] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 1 });
  const [columnVisibility] = useState({
    codigo: false,
    columnId3: true,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: filtering,
      pagination,
      columnVisibility,
    },
    onGlobalFilterChange: setFiltering,
    onPaginationChange: setPagination,
  });

  const clickHandler = () => {
    setFiltering("");
  };

  useEffect(() => {
    setFiltering("");
  }, [clearinput]);

  return (
    <div className="flx jcenter pad-0 border-1 b-radius m-05">
      <div className="flx  pad-0">
        <button className="btn-icon-container minw-20 m-0" onClick={clickHandler}>
          <CloseIcon />
        </button>
        <input
          type="text"
          className="pad-05 b-radius border-1 m-05 centrado w-80"
          value={filtering}
          placeholder="Codigo"
          onChange={(e) => setFiltering(e.target.value)}
        />
      </div>

      {filtering && (
        <table className="table-facturacion ml">
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
      )}
    </div>
  );
}

export default FacturacionTable;
