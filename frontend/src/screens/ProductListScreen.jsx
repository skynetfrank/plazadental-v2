import { useEffect, useState } from "react";
import SimpleTable from "../components/SimpleTable";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CogIcon from "../icons/CogIcon";
import ConteoIcon from "../icons/ConteoIcon";
import ReloadIcon from "../icons/ReloadIcon";

export default function ProductListScreen() {
  const navigate = useNavigate("");
  const [productos, setProductos] = useState(JSON.parse(localStorage.getItem("productos")));
  const [calzados, setCalzados] = useState(0);
  const [textiles, setTextiles] = useState(0);

  const [tallaFound, setTallaFound] = useState(false);

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  useEffect(() => {
    setCalzados(productos.filter((x) => x.categoria === "CALZADO").reduce((suma, c) => suma + c.existencia, 0));
    setTextiles(productos.filter((x) => x.categoria === "TEXTILES").reduce((suma, c) => suma + c.existencia, 0));
  }, []);

  useEffect(() => {
    const reloadProducts = () => {
      fetch("https://us-east-1.aws.data.mongodb-api.com/app/application-0-leavi/endpoint/allproductschacao")
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("productos", JSON.stringify(data));
          setProductos(JSON.parse(localStorage.getItem("productos")));
        })
        .catch((error) => console.log(error));
    };
    reloadProducts();
  }, []);

  const columns = [
    {
      header: "Imagen",
      accessorKey: "imageurl",
      footer: "Imagen",
      cell: (info) => {
        return <img className="table-img b-radius" src={info.getValue()} />;
      },
    },
    {
      header: "Codigo",
      accessorKey: "codigo",
      cell: (info) => {
        const { codigo, _id } = info.row.original;
        return (
          <div className="flx column">
            <span>{codigo}</span>
            {userInfo.isAdmin ? (
              <button className="btn-icon-container" onClick={() => navigate(`/product/${_id}/edit`)}>
                <CogIcon />
              </button>
            ) : (
              ""
            )}
            <button className="btn-icon-container" onClick={() => navigate(`/conteorapido/${_id}`)}>
              <ConteoIcon />
            </button>
          </div>
        );
      },
    },
    { header: "Tipo", accessorKey: "tipo" },
    { header: "Genero", accessorKey: "genero" },
    { header: "Marca", accessorKey: "marca" },
    { header: "Modelo", accessorKey: "modelo" },
    { header: "Precio $", accessorKey: "preciousd" },
    { header: "Existencia", accessorKey: "existencia" },
    {
      header: "Tallas",
      accessorKey: "tallas",
      cell: (info) => {
        const { tallas } = info.row.original;
        const stock = Object.values(tallas).reduce((total, x) => total + x, 0);

        if (!tallas) {
          return "";
        }
        return stock <= 0 ? (
          <span className="negrita">No Disponible</span>
        ) : (
          <span className="flx">
            {Object.keys(tallas).map((key, index) => {
              if (tallas[key] === 0) {
                return "";
              }

              return (
                <div className="flx column astart pad-0 m-05" key={index}>
                  <p className="centrado minw-20 negrita subrayado">{key}</p>
                  <p className="centrado minw-20">{tallas[key]}</p>
                </div>
              );
            })}
          </span>
        );
      },
      footer: "Tallas",
    },
    { header: "Grupo", accessorKey: "categoria" },
  ];

  const tallaHandler = () => {
    // GETA TALLA AQUI
    Swal.fire({
      title: "Ingresa Una Talla",
      input: "text",
      showCancelButton: true,
      confirmButtonText: "Enviar",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value) {
          return "Debe Ingresar Una Talla!";
        }
      },
    }).then((resultado) => {
      if (resultado.value) {
        const talla = resultado.value.toUpperCase();
        setProductos((prev) => {
          const newProducts = prev.filter((p) => p.tallas[talla] > 0);
          return newProducts;
        });
        setTallaFound(true);
      }
    });
    // GETA TALLA AQUI
  };

  const removeFilterHandler = () => {
    window.location.reload();
  };

  return (
    <div>
      <div className="flx column">
        <h2 className="centrado">Productos Chacao</h2>
        <span className="font-1">Calzados: {calzados} pares</span>
        <span className="font-1">Textiles: {textiles} unidades</span>
      </div>

      {productos.length <= 0 ? (
        <span>NO HA PRODUCTOS...</span>
      ) : (
        <>
          <div className="pos-rel">
            {!tallaFound ? (
              <button
                className="btn-talla"
                onClick={() => {
                  tallaHandler();
                }}
              >
                Buscar Una Talla
              </button>
            ) : (
              ""
            )}
            {tallaFound ? (
              <button
                className="btn-talla"
                onClick={() => {
                  removeFilterHandler();
                }}
              >
                Quitar Filtro Talla
              </button>
            ) : (
              ""
            )}

            <div>
              {productos ? <SimpleTable data={productos} columns={columns} filterInput={true} botonera={true} /> : ""}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
