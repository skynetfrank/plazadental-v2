


() => [
    {
      header: "No.",
      id: "id",
      cell: (info) => {
        return (
          <Link to={`/order/${info.row.original._id}`}>
            <span className="row-counter">{info.row.index}</span>{" "}
          </Link>
        );
      },
    },
    {
      header: "CODIGO - TALLA - PRECIO ",
      accessorKey: "orderItems",
      className: "td-show-items",
      Footer: (info) => {
        const totalitems = React.useMemo(
          () =>
            info.rows.reduce(
              (sum, row) =>
                row.values.orderItems.reduce(
                  (xsum, xitem) => xitem.qty + xsum,
                  0
                ) + sum,
              0
            ),
          [info.rows]
        );
        return <>Articulos Vendidos: {Number(totalitems)}</>;
      },

      cell: (value) => {
        const { orderItems } = value.row.values;
        const memo = value.row.original.pago.memo;

        if (!orderItems) {
          return " ";
        }
        return (
          <div>
            {orderItems.map((item, inx) => (
              <div
                className="cuadre__items_container"
                key={item.producto + inx}>
                <div className="items-detail">
                  <p className="item-codigo">{item.codigo}</p>
                  <p className="p-talla">{item.talla}</p>
                  <p className="p-precio">${item.precio}</p>
                  <p className="p-x">X</p>
                  <span id="item-qty">{item.qty}</span>
                </div>
              </div>
            ))}
            {memo ? <p className="tiny-memo">memo: {memo}</p> : ""}
          </div>
        );
      },
    },

    {
      header: "Articulos $",
      accessorKey: "totalItems",
      cell: ({ value }) => {
        return "$" + Number(value).toFixed(2);
      },
      Footer: (info) => {
        const total = React.useMemo(
          () =>
            info.rows.reduce((sum, row) => row.values.totalItems + sum, 0),
          [info.rows]
        );
        return <>${Number(total).toFixed(2)}</>;
      },
    },
    {
      header: "- Descuento",
      accessorKey: "descuento",
      cell: ({ value }) => {
        return "$" + Number(value).toFixed(2);
      },
      Footer: (info) => {
        const total = React.useMemo(
          () => info.rows.reduce((sum, row) => row.values.descuento + sum, 0),
          [info.rows]
        );
        return <>${Number(total).toFixed(2)}</>;
      },
    },
    {
      header: "+ Delivery",
      accessorKey: "delivery",
      cell: ({ value }) => {
        return "$" + Number(value).toFixed(2);
      },
      Footer: (info) => {
        const total = React.useMemo(
          () => info.rows.reduce((sum, row) => row.values.delivery + sum, 0),
          [info.rows]
        );
        return <>${Number(total).toFixed(2)}</>;
      },
    },
    {
      header: "Monto a Pagar $",
      accessorKey: "subtotal",
      cell: ({ value }) => {
        return "$" + Number(value).toFixed(2);
      },
      Footer: (info) => {
        const total = React.useMemo(
          () => info.rows.reduce((sum, row) => row.values.subtotal + sum, 0),
          [info.rows]
        );
        return <>${Number(total).toFixed(2)}</>;
      },
    },
    {
      header: "Dolares",
      accessorKey: "pago.efectivousd",
      cell: ({ value }) => {
        if (!value) {
          return "-";
        }
        return "$" + Number(value).toFixed(2);
      },
      Footer: (info) => {
        const total = React.useMemo(
          () =>
            info.rows.reduce(
              (sum, row) => row.values["pago.efectivousd"] + sum,
              0
            ),
          [info.rows]
        );
        return <>${Number(total).toFixed(2)}</>;
      },
    },
    {
      header: "EUROS",
      accessorKey: "pago.efectivoeuros",
      cell: ({ value }) => {
        if (!value) {
          return "-";
        }
        return "€" + Number(value).toFixed(2);
      },
      Footer: (info) => {
        const total = React.useMemo(
          () =>
            info.rows.reduce(
              (sum, row) => row.values["pago.efectivoeuros"] + sum,
              0
            ),
          [info.rows]
        );
        return <>${Number(total).toFixed(2)}</>;
      },
    },
    {
      header: "Bolivares",
      accessorKey: "pago.efectivobs",
      cell: ({ value }) => {
        if (!value) {
          return "-";
        }
        return "Bs" + Number(value).toFixed(2);
      },
      Footer: (info) => {
        const total = React.useMemo(
          () =>
            info.rows.reduce(
              (sum, row) => row.values["pago.efectivobs"] + sum,
              0
            ),
          [info.rows]
        );
        return <>Bs{Number(total).toFixed(2)}</>;
      },
    },

    {
      header: "Punto Venta",
      accessorKey: "pago.punto.montopunto",

      cell: ({ value, row, flatRows }) => {
        const obj1 = row.original.pago.punto;

        if (!obj1.montopunto) {
          return "-";
        }

        return (
          <div className="reporte-pago-punto-column">
            <span>
              {"Bs" + obj1.montopunto + " " + obj1.bancodestinopunto}
            </span>
            {obj1.montopunto2 ? (
              <span>
                {"Bs" + obj1.montopunto2 + " " + obj1.bancodestinopunto2}
              </span>
            ) : (
              ""
            )}

            {obj1.montopunto3 ? (
              <span>
                {"Bs" + obj1.montopunto3 + " " + obj1.bancodestinopunto3}
              </span>
            ) : (
              ""
            )}
          </div>
        );
      },

      Footer: (info) => {
        const total = React.useMemo(
          () =>
            info.rows.reduce(
              (sum, row) =>
                (row.original.pago.punto.montopunto || 0) +
                (row.original.pago.punto.montopunto2 || 0) +
                (row.original.pago.punto.montopunto3 || 0) +
                sum,
              0
            ),
          [info.rows]
        );
        return <>Bs{Number(total).toFixed(2)}</>;
      },
    },

    {
      header: "Pago Movil",
      accessorKey: "pago.pagomovil.montopagomovil",
      cell: (value) => {
        //const { pago } = value.row.values;
        if (!value.row.values["pago.pagomovil.montopagomovil"]) {
          return "-";
        }

        return (
          <span>
            {"Bs" +
              value.row.values["pago.pagomovil.montopagomovil"] +
              " " +
              value.row.values["pago.pagomovil.bancodestinopagomovil"]}
          </span>
        );
      },
      Footer: (info) => {
        const total = React.useMemo(
          () =>
            info.rows.reduce(
              (sum, row) => row.values["pago.pagomovil.montopagomovil"] + sum,
              0
            ),
          [info.rows]
        );
        return <>Bs{Number(total).toFixed(2)}</>;
      },
    },

    {
      header: "Zelle",
      accessorKey: "pago.zelle.montozelle",
      cell: (value) => {
        if (!value.row.values["pago.zelle.montozelle"]) {
          return "-";
        }
        return (
          <span>
            {"$" +
              value.row.values["pago.zelle.montozelle"] +
              " " +
              value.row.values["pago.zelle.zelletitular"] +
              " " +
              "Ref" +
              value.row.values["pago.zelle.zelleref"]}
          </span>
        );
      },
      Footer: (info) => {
        const total = React.useMemo(
          () =>
            info.rows.reduce(
              (sum, row) => row.values["pago.zelle.montozelle"] + sum,
              0
            ),
          [info.rows]
        );
        return <>${Number(total).toFixed(2)}</>;
      },
    },
    {
      header: "",
      accessorKey: "pago.zelle.zelletitular",
      cell: ({ value }) => {
        return "";
      },
    },
    {
      header: "",
      accessorKey: "pago.zelle.zelleref",
      cell: ({ value }) => {
        return "";
      },
    },
    {
      header: "",
      accessorKey: "pago.punto.bancodestinopunto",
      cell: ({ value }) => {
        return "";
      },
    },
    {
      header: "",
      accessorKey: "pago.pagomovil.bancodestinopagomovil",
      cell: ({ value }) => {
        return "";
      },
    },
  ],
  []











  /////resumen cuadre del dia

  {
    <div className=" flx column font-1 minw-200">
      <label>Resumen de Pagos</label>
      <div className="flx sb gap3">
        <span>Efectivo Dolares:</span>
        <span>{Number(cash?.totalCashusd).toFixed(2)}</span>
      </div>
      <div className="flx sb gap3">
        <span>Efectivo Euros:</span>
        <span>{Number(cash?.totalCasheuros).toFixed(2)}</span>
      </div>
      <div className="flx sb gap3">
        <span>Efectivo Bolivares:</span>
        <span>{Number(cash?.totalCashbs).toFixed(2)}</span>
      </div>
      <div className="flx sb gap3">
        <span>Punto Plaza:</span>
        <span>
          {Number(
            puntoPlaza?.reduce((sum, p) => p.totalpuntoplaza + sum, 0)
          ).toFixed(2)}
        </span>
      </div>
      <div className="flx sb gap3">
        <span>Punto Venezuela:</span>
        <span>
          {Number(
            puntoVenezuela?.reduce((sum, p) => p.totalpuntovzla + sum, 0)
          ).toFixed(2)}
        </span>
      </div>
      <div className="flx sb gap3">
        {" "}
        <span> Punto Banesco:</span>
        <span>
          {Number(
            puntoBanesco?.reduce((sum, p) => p.totalpuntobanes + sum, 0)
          ).toFixed(2)}
        </span>
      </div>

      <div className="flx sb gap3">
        <span>Pagomovil:</span>
        <span>{Number(cash?.totalpagomobil).toFixed(2)}</span>
      </div>
      <div className="flx sb gap3">
        <span>Zelle:</span>
        <span>{Number(cash?.totalzelle).toFixed(2)}</span>
      </div>
      <div className="total-ventas">
        <span>Total Venta:</span>
        <span>Bs. {Number(subtotalcuadre).toFixed(2)}</span>
      </div>
    </div>
  }




  //metodo para sumar en el footer sino es un array de objectos

  {
    accessorKey: 'your_accessor_key',
    footer: ({ table }) => table.getFilteredRowModel().rows.reduce((total, row) => total + row.getValue('your_accessor_key'), 0),
  }