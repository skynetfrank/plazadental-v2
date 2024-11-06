import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { cargarStock } from "../actions/productActions";
import Swal from "sweetalert2";
import { PRODUCT_CARGARSTOCK_RESET } from "../constants/productConstants";
import PrintIcon from "../icons/PrintIcon";
import BrandHeader from "../components/BrandHeader";
import UploadIcon from "../icons/Uploadicon";
import ToolTip from "../components/ToolTip";

export default function ReposicionScreen(props) {
  const navigate = useNavigate();
  const params = useParams();
  const { id: reposicionId } = params;
  const [reposicion, setReposicion] = useState({});
  const [productos, setProductos] = useState([]);
  const [productosChacao, setProductosChacao] = useState([]);

  const productCargaStock = useSelector((state) => state.productCargaStock);
  const { loading, success, procesados, error } = productCargaStock;
  const dispatch = useDispatch();

  useEffect(() => {
    fetch(
      "https://us-east-1.aws.data.mongodb-api.com/app/application-0-leavi/endpoint/allproducts"
    )
      .then((response) => response.json())
      .then((data) => {
        setProductos(data);
      })
      .catch((error) => console.log(error));

    fetch(
      `https://us-east-1.aws.data.mongodb-api.com/app/application-0-leavi/endpoint/getreposicion?id=${reposicionId}`
    )
      .then((response) => response.json())
      .then((data) => {
        setReposicion(data[0]);
      })
      .catch((error) => console.log(error));

    fetch(
      `https://us-east-1.aws.data.mongodb-api.com/app/application-0-leavi/endpoint/allproductschacao`
    )
      .then((response) => response.json())
      .then((data) => {
        setProductosChacao(data);
        console.log("productosChacao", data);
      })
      .catch((error) => console.log(error));
  }, []);

  const imprimir = () => {
    window.print();
  };

  const loadHandler = async () => {
    if (reposicion.procesado) {
      Swal.fire("Reposicion Ya Fue Cargada al Inventario!");
      return;
    }
    if (reposicion.items.length <= 0) {
      Swal.fire({
        title: "La Reposicion No Tiene Articulos!",
        text: "Reposicion Vacia!",
        icon: "warning",
      });
      return;
    }

    const { value: password } = await Swal.fire({
      title: "Clave de Autorizacion",
      input: "password",
      inputAttributes: {
        maxlength: "10",
        autocapitalize: "off",
        autocorrect: "off",
      },
    });
    if (password !== "demoda01*") {
      Swal.fire("Clave Incorrecta! Verifique!");
      return;
    }
    dispatch(cargarStock({ items: reposicion.items, repoId: reposicionId }));
  };

  useEffect(() => {
    if (success) {
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(procesados),
      };
      fetch(
        `https://us-east-1.aws.data.mongodb-api.com/app/application-0-leavi/endpoint/updatestatusrepo?id=${reposicionId}`,
        requestOptions
      )
        .then((data) => {
          console.log("reposicion Actualizada:" + data);
        })
        .catch((error) => console.log(error));

      Swal.fire({
        title: "Reposicion Procesada!",
        text: "Cargar Productos al Inventario",
        icon: "success",
        showCloseButton: true,
      });

      dispatch({ type: PRODUCT_CARGARSTOCK_RESET });
      navigate("/reposicionlist");
    }
  }, [dispatch, navigate, procesados, reposicionId, success]);

  useEffect(() => {
    if (error) {
      Swal.fire("Ocurrio un Error! " + error);
    }
  }, [error]);
  console.log("reposicion", reposicion);

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : (
    <div className="maxw-500 mauto">
      <BrandHeader />
      <h4 className="centrado">NOTA DE ENTREGA ({reposicion.tipo})</h4>
      <p className="centrado font-1">
        status: {reposicion.procesado ? "CARGADO AL INVENTARIO" : "PENDIENTE"}
      </p>
      <div className="flx jsb gap3 pad-0">
        <button className="btn-icon-container" onClick={imprimir}>
          <PrintIcon />
        </button>
        {reposicion?.procesado === false ? (
          <ToolTip text="Cargar al Inventario de Chacao">
            <button className="btn-icon-container" onClick={loadHandler}>
              <UploadIcon />
            </button>
          </ToolTip>
        ) : (
          ""
        )}
      </div>

      <div className="flx gap pad-1 border-1 b-radius m-05">
        <div className="flx column astart font-12 pad-0">
          <p>Fecha: {dayjs(reposicion.fecha).format("DD/MM/YYYY")}</p>
          <p>
            ID Numero: {reposicion._id} {reposicion.procesado}
          </p>
          <p className="font-12">Sucursal: {reposicion.sucursal}</p>
        </div>
      </div>

      {reposicion.items?.length > 0 ? (
        <div>
          <div className="flx jstart font-12 border-1 pad-05">
            <p className="mr">Producto</p>
            <p className="ml mr minw-200 mr-3">Cantidades por Tallas</p>
            <p className="mr ml">Cant.</p>
            <p className="mr ml">Precio</p>
            <p className="mr ml-2">Monto $</p>
          </div>

          {reposicion?.items
            .sort(function (a, b) {
              const nameA = a.producto.codigo?.toUpperCase(); // ignore upper and lowercase
              const nameB = b.producto.codigo?.toUpperCase(); // ignore upper and lowercase

              // sort in an ascending order
              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }

              // names must be equal
              return 0;
            })
            .map((item, idx) => {
              const articulo = productos?.find((x) => x._id === item.producto);

              return (
                <div
                  className="flx jstart font-12 border-bottom pad-0"
                  key={idx}>
                  <div className="flx column pad-0 ml mr">
                    <span>{articulo?.codigo}</span>
                    <span className="minw-80 centrado">{articulo?.marca}</span>
                  </div>

                  <div className="flx pad-0 ml mr minw-200" key={idx}>
                    {Object.keys(item.tallas).map((key, inx) => {
                      return (
                        <>
                          {Number(item.tallas[key]) > 0 && (
                            <div className="m-05" key={inx}>
                              <span className="border-bottom">{key}</span>
                              <p className="centrado">{item.tallas[key]}</p>
                            </div>
                          )}
                        </>
                      );
                    })}
                  </div>
                  <span className="ml-2 mr-2">{item.cantidad}</span>
                  <span className="ml-2 mr-2">${articulo?.preciousd}</span>
                  <span className="ml-2 mr">
                    {(articulo?.preciousd * item.cantidad).toFixed(2)}
                  </span>
                </div>
              );
            })}
          <div className="flx jsb gap pad-1 border-1 m-05 negrita">
            <p>
              Total Unidades:
              {reposicion.items.reduce(
                (accum, item) => accum + item.cantidad,
                0
              )}
            </p>
            <p>Total General $:{reposicion.totalItems}</p>
          </div>
          {reposicion.itemsProcesados ? (
            <div>
              <div className="font-x border-1 pad-05 negrita">
                <span>
                  {reposicion.itemsProcesados.length + " CODIGOS "}CARGADOS:{" "}
                </span>
                {reposicion?.itemsProcesados.map((x, inx) => {
                  return <span key={inx}>{x + " "}</span>;
                })}
              </div>
              {reposicion.items.length === reposicion.itemsProcesados.length ? (
                ""
              ) : (
                <div className="font-x border-1 pad-05 negrita">
                  <span>
                    NO SE CARGARON {" "}
                    {reposicion.items.length -
                      reposicion.itemsProcesados.length}{" "}
                    CODIGOS
                  </span>
                </div>
              )}
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
