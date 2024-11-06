import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Swal from "sweetalert2";
import { searchProduct } from "../actions/productActions";
import SimpleTable from "../components/SimpleTable";
import SearchIcon from "../icons/SearchIcon";

export default function ProductoSearchScreen() {
  const productSearch = useSelector((state) => state.productSearch);
  const { loading, frailes, chacao, merpo, error } = productSearch;
  const dispatch = useDispatch();
  console.log("frailes", frailes);
  const columnsFrailes = [
    {
      header: frailes ? frailes[0]?.codigo : "Imagen",
      accessorKey: "imageurl",
      footer: "Imagen",
      cell: (value) => {
        return <img className="table-img b-radius" src={value.getValue()} />;
      },
    },

    {
      header: "ALMACEN LOS FRAILES",
      accessorKey: "tallas",
      cell: (info) => {
        const { tallas, existencia, marca, modelo, preciousd } =
          info.row.original;
        const stock = Object.values(tallas).reduce((total, x) => total + x, 0);

        if (!tallas) {
          return "";
        }
        return stock <= 0 ? (
          <span className="negrita">No hay Disponible</span>
        ) : (
          <div className="flx column pad-0 minw-150">
            <div className="flx pad-0">
              <h2>{marca}</h2>
              <h3 className="ml">{modelo}</h3>
              <h3 className="ml">${Number(preciousd).toFixed(2)}</h3>
            </div>
            <h4>{existencia} pares disponibles</h4>
            <span className="flx pad-0">
              {Object.keys(tallas).map((key, index) => {
                if (tallas[key] === 0) {
                  return "";
                }

                return (
                  <div className="flx column astart pad-0" key={index}>
                    <p className="centrado minw-20 negrita subrayado font-1">
                      {key}
                    </p>
                    <p className="centrado minw-20">{tallas[key]}</p>
                  </div>
                );
              })}
            </span>
          </div>
        );
      },
      footer: "Tallas",
    },
  ];

  const columnsChacao = [
    {
      header: chacao ? chacao[0]?.codigo : "Imagen",
      accessorKey: "imageurl",
      footer: "Imagen",
      cell: (info) => {
        return <img className="table-img b-radius" src={info.getValue()} />;
      },
    },

    {
      header: "TIENDA CHACAO",
      accessorKey: "tallas",
      cell: (info) => {
        const { tallas, existencia, preciousd, marca, modelo } =
          info.row.original;
        const stock = Object.values(tallas).reduce((total, x) => total + x, 0);

        if (!tallas) {
          return "";
        }
        return stock <= 0 ? (
          <span className="negrita">No hay Disponible</span>
        ) : (
          <div className="flx column pad-0 minw-150">
            <div className="flx pad-0">
              <h2>{marca}</h2>
              <h3 className="ml">{modelo}</h3>
              <h3 className="ml">${Number(preciousd).toFixed(2)}</h3>
            </div>
            <h4>{existencia} pares disponibles</h4>
            <span className="flx pad-0">
              {Object.keys(tallas).map((key, index) => {
                if (tallas[key] === 0) {
                  return "";
                }

                return (
                  <div className="flx column astart pad-0" key={index}>
                    <p className="centrado minw-20 negrita subrayado font-1">
                      {key}
                    </p>
                    <p className="centrado minw-20">{tallas[key]}</p>
                  </div>
                );
              })}
            </span>
          </div>
        );
      },

      footer: "Tallas",
    },
  ];

  const columnsMerpo = [
    {
      header: merpo ? merpo[0]?.codigo : "Imagen",
      accessorKey: "imageurl",
      footer: "Imagen",
      cell: (info) => {
        return <img className="table-img b-radius" src={info.getValue()} />;
      },
    },

    {
      header: "TIENDA MERPOESTE",
      accessorKey: "tallas",
      cell: (info) => {
        const { tallas, existencia, preciousd, marca, modelo } =
          info.row.original;
        const stock = Object.values(tallas).reduce((total, x) => total + x, 0);

        if (!tallas) {
          return "";
        }
        return stock <= 0 ? (
          <span className="negrita">No hay Disponible</span>
        ) : (
          <div className="flx column pad-0 minw-150">
            <div className="flx pad-0">
              <h2>{marca}</h2>
              <h3 className="ml">{modelo}</h3>
              <h3 className="ml">${Number(preciousd).toFixed(2)}</h3>
            </div>
            <h4>{existencia} pares disponibles</h4>
            <span className="flx pad-0">
              {Object.keys(tallas).map((key, index) => {
                if (tallas[key] === 0) {
                  return "";
                }

                return (
                  <div className="flx column astart pad-0" key={index}>
                    <p className="centrado minw-20 negrita subrayado font-1">
                      {key}
                    </p>
                    <p className="centrado minw-20">{tallas[key]}</p>
                  </div>
                );
              })}
            </span>
          </div>
        );
      },

      footer: "Tallas",
    },
  ];

  const buscadorHandler = async () => {
    const { value: codigo } = await Swal.fire({
      input: "text",
      inputLabel: "Codigo del Producto",
      inputPlaceholder: "Ingresa un codigo de producto",
      showCancelButton: true,
      confirmButtonText: "Buscar",
    });
    if (codigo === "" || codigo === " ") {
      return;
    }

    dispatch(searchProduct(String(codigo).toUpperCase()));
  };

  return (
    <div>
      <div className="flx jcenter pad-0">
        <h5 className="centrado">BUSCAR EN TODAS LAS TIENDAS DEMODA</h5>
        <button className="buscador pad-0 minw-60" onClick={buscadorHandler}>
          <SearchIcon />
        </button>
      </div>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <div>
            <div className="flx column jcenter pad-0">
              {frailes?.length > 0 ? (
                <div>
                  {frailes ? (
                    <SimpleTable
                      data={frailes}
                      columns={columnsFrailes}
                      filterInput={false}
                      botonera={false}
                    />
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}
              {chacao?.length > 0 ? (
                <div>
                  {chacao ? (
                    <SimpleTable
                      data={chacao}
                      columns={columnsChacao}
                      filterInput={false}
                      botonera={false}
                    />
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}
              {merpo?.length > 0 ? (
                <div>
                  {chacao ? (
                    <SimpleTable
                      data={merpo}
                      columns={columnsMerpo}
                      filterInput={false}
                      botonera={false}
                    />
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
