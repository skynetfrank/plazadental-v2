import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteDoctor, listDoctores } from '../actions/doctorActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function DoctorListScreen(props) {
  const navigate = useNavigate();
  const { pageNumber = 1 } = useParams();
  const [palabra, setPalabra] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const doctorList = useSelector(state => state.doctorList);
  const { loading, error, doctores } = doctorList;

  const doctorDelete = useSelector(state => state.doctorDelete);
  const { loading: loadingDelete, error: errorDelete, success: successDelete } = doctorDelete;

  const dispatch = useDispatch();

  useEffect(() => {
    if (busqueda === '') {
      dispatch(listDoctores({ pageNumber }));
    } else {
      dispatch(listDoctores({ busqueda, pageNumber }));
    }
  }, [busqueda, dispatch, pageNumber]);

  const busquedaHandler = () => {
    setBusqueda(palabra);
  };

  const palabraHandler = e => {
    setPalabra(e.target.value);
  };

  const clearSearch = () => {
    setBusqueda('');
    setPalabra('');
    navigate('/doctorlist');
  };

  const deleteHandler = order => {
    if (window.confirm('Esta Seguro de Eliminar este Doctor?')) {
      dispatch(deleteDoctor(order._id));
    }
  };

  return (
    <div className="main-container">
      <h1>Doctores</h1>
      <div className="barra-botones">
        <div className="search-div">
          <input
            type="text"
            value={palabra}
            className="search-input"
            placeholder="buscar..."
            onChange={palabraHandler}
          ></input>
          <FontAwesomeIcon icon={faSearch} onClick={busquedaHandler} />
          <button id="btn-clear" className="button small" onClick={clearSearch}>
            &#10008;
          </button>
        </div>
        <Link to="/creardoctor">
          <button className="icon-btn add-btn">
            <div className="add-icon"></div>
            <div className="btn-txt">Agregar Doctor</div>
          </button>
        </Link>
      </div>

      {loadingDelete && <LoadingBox></LoadingBox>}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <React.Fragment key={99}>
          <table className="table table-container__table table-container__table--break-sm">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Cedula</th>
                <th>Celular</th>
                <th>Especialidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {doctores.map(doctor => (
                <tr key={doctor._id}>
                  <td data-heading="Nombre">{doctor.nombre}</td>
                  <td data-heading="Apellido">{doctor.apellido}</td>
                  <td data-heading="Cedula">{doctor.cedula}</td>
                  <td data-heading="Celular">{doctor.celular}</td>
                  <td data-heading="Especialidad">{doctor.especialidad}</td>
                  <td data-heading="Acciones" className="menu-show-all">
                    <button
                      className="btn-circle"
                      type="button"
                      onClick={() => {
                        navigate(`/doctor/${doctor._id}/edit`);
                      }}
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>

                    <button type="button" className="btn-circle" onClick={() => deleteHandler(doctor)}>
                      <FontAwesomeIcon icon={faTrash} />
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </React.Fragment>
      )}
    </div>
  );
}
