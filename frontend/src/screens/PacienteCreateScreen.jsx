import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPaciente } from "../actions/pacienteActions";
import { useNavigate } from "react-router-dom";
import { PACIENTE_CREATE_RESET } from "../constants/pacienteConstants";
import { CONTROL_CREATE_RESET } from "../constants/controlConstants";
import { NumericFormat } from "react-number-format";
import Swal from "sweetalert2";

export default function PacienteCreateScreen(props) {
  const navigate = useNavigate();
  const options1 = [
    { id1: 1, name1: " SI" },
    { id1: 2, name1: " NO" },
  ];
  const options2 = [
    { id2: 1, name2: " SI" },
    { id2: 2, name2: " NO" },
  ];
  const options3 = [
    { id3: 1, name3: " SI" },
    { id3: 2, name3: " NO" },
  ];
  const options4 = [
    { id4: 1, name4: " SI" },
    { id4: 2, name4: " NO" },
  ];
  const options5 = [
    { id5: 1, name5: " SI" },
    { id5: 2, name5: " NO" },
  ];
  const options6 = [
    { id6: 1, name6: " SI" },
    { id6: 2, name6: " NO" },
  ];
  const arrayAlergias = [
    {
      name: "Aspirina",
    },
    {
      name: "Penicilina",
    },
    {
      name: "Codeina",
    },
    {
      name: "Latex",
    },
    {
      name: "Acrilico",
    },
    {
      name: "Anestesia Local",
    },
  ];

  const arrayPersonalBg = [
    {
      name: "Ha Sido Hospitalizado o Tuvo una Cirugía",
    },
    {
      name: "Ha Tenido una Lesión Grave en Cabeza o Cuello",
    },
    {
      name: "Tiene Alguna Dieta Especial",
    },
    {
      name: "Es Fumador o Consume Algún Tipo de Tabaco",
    },
    {
      name: "Usa Sustancias Controladas",
    },
    {
      name: "Esta Embarazada Actualmente",
    },
    {
      name: "Esta Tomando Anticonceptivos Orales",
    },
  ];

  const arrayFamiliarBg = [
    {
      name: "Cancer",
    },
    {
      name: "Tuberculosis",
    },
    {
      name: "H.I.V.",
    },
    {
      name: "Diabetes",
    },
    {
      name: "Venereas",
    },
    {
      name: "Cardiovasculares",
    },
    {
      name: "Hemorragicas",
    },
  ];

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [cedula, setCedula] = useState("");
  const [nombrerepresentante, setNombrerepresentante] = useState("");
  const [apellidorepresentante, setApellidorepresentante] = useState("");
  const [cedularepresentante, setCedularepresentante] = useState("");
  const [genero, setGenero] = useState("");
  const [estadoCivil, setEstadoCivil] = useState("");
  const [Nacimiento, setNacimiento] = useState("");
  const [edad, setEdad] = useState("");
  const [peso, setPeso] = useState("");
  const [estatura, setEstatura] = useState("");
  const [direccion, setDireccion] = useState("");
  const [celular, setCelular] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [contacto, setContacto] = useState("");
  const [alergias, setAlergias] = useState([]);
  const [otrasAlergias, setOtrasAlergias] = useState("");
  const [isAlergicoOtros, setIsAlergicoOtros] = useState(false);
  const [antecedentesFamiliares, setAntecedentesFamiliares] = useState([]);
  const [antecedentesPersonales, setAntecedentesPersonales] = useState([]);
  const [isTratadoPorMedico, setIsTratadoPorMedico] = useState(false);
  const [tratadoPorEnfermedad, setTratadoPorEnfermedad] = useState("");
  const [otraEnfermedad, setOtraEnfermedad] = useState("");
  const [isOtraEnfermedad, setIsOtraEnfermedad] = useState(false);
  const [isTomaMedicamentos, setIsTomaMedicamentos] = useState(false);
  const [medicamentos, setMedicamentos] = useState("");
  const [dosismeds, setDosismeds] = useState("");
  const [habitos, setHabitos] = useState("");
  const [motivoEstaConsulta, setMotivoEstaconsulta] = useState("");
  const [motivoUltimaConsulta, setMotivoUltimaConsulta] = useState("");
  const [fechaUltimaconsulta, setFechaUltimaconsulta] = useState("");
  const [isComplicaciones, setIsComplicaciones] = useState(false);
  const [complicaciones, setComplicaciones] = useState("");
  const [idOdontoImgName, setIdOdontoImgName] = useState("");
  const [controles, setControles] = useState([]);
  const [checkedList1, setCheckedList1] = useState(options1);
  const [checkedList2, setCheckedList2] = useState(options2);
  const [checkedList3, setCheckedList3] = useState(options3);
  const [checkedList4, setCheckedList4] = useState(options4);
  const [checkedList5, setCheckedList5] = useState(options5);
  const [checkedList6, setCheckedList6] = useState(options6);
  const [isHabitos, setIsHabitos] = useState(false);
  const [odontogramaUrl, setOdontogramaUrl] = useState(
    "https://res.cloudinary.com/plazasky/image/upload/v1661300750/odontogramas/odograma1.jpg"
  );

  const [checkedState, setCheckedState] = useState(new Array(arrayAlergias.length).fill(false));
  const [checkedState2, setCheckedState2] = useState(new Array(arrayPersonalBg.length).fill(false));
  const [checkedState3, setCheckedState3] = useState(new Array(arrayFamiliarBg.length).fill(false));

  const selEdoCivil = ["", "Soltero", "Casado", "Otro"];
  const selGenero = ["", "Femenino", "Masculino", "Niño", "Niña", "Otro"];

  const pacienteCreate = useSelector((state) => state.pacienteCreate);
  const { error, success, paciente } = pacienteCreate;

  const dispatch = useDispatch();

  //simalador de SI NO BOTONES
  function toggleOption1(id, checked1) {
    return options1.map((option) => (option.id1 === id ? { ...option, checked1 } : option));
  }

  function toggleOption2(id, checked) {
    return options2.map((option) => (option.id2 === id ? { ...option, checked } : option));
  }

  function toggleOption3(id, checked) {
    return options3.map((option) => (option.id3 === id ? { ...option, checked } : option));
  }

  function toggleOption4(id, checked) {
    return options4.map((option) => (option.id4 === id ? { ...option, checked } : option));
  }

  function toggleOption5(id, checked) {
    return options5.map((option) => (option.id5 === id ? { ...option, checked } : option));
  }

  function toggleOption6(id, checked) {
    return options6.map((option) => (option.id6 === id ? { ...option, checked } : option));
  }

  const changeList = (id, checked) => {
    const newCheckedList = toggleOption1(id, checked);
    setCheckedList1(newCheckedList);
    if (id === 1) {
      setIsTratadoPorMedico(true);
    }
    if (id === 2) {
      setIsTratadoPorMedico(false);
    }
  };

  const changeList2 = (id, checked) => {
    const newCheckedList2 = toggleOption2(id, checked);
    setCheckedList2(newCheckedList2);
    if (id === 1) {
      setIsTomaMedicamentos(true);
    }
    if (id === 2) {
      setIsTomaMedicamentos(false);
    }
  };

  const changeList3 = (id, checked) => {
    const newCheckedList3 = toggleOption3(id, checked);
    setCheckedList3(newCheckedList3);
    if (id === 1) {
      setIsAlergicoOtros(true);
    }
    if (id === 2) {
      setIsAlergicoOtros(false);
    }
  };

  const changeList4 = (id, checked) => {
    const newCheckedList4 = toggleOption4(id, checked);
    setCheckedList4(newCheckedList4);
    if (id === 1) {
      setIsHabitos(true);
    }
    if (id === 2) {
      setIsHabitos(false);
    }
  };

  const changeList5 = (id, checked) => {
    const newCheckedList5 = toggleOption5(id, checked);
    setCheckedList5(newCheckedList5);
    if (id === 1) {
      setIsOtraEnfermedad(true);
    }
    if (id === 2) {
      setIsOtraEnfermedad(false);
    }
  };

  const changeList6 = (id, checked) => {
    const newCheckedList6 = toggleOption6(id, checked);
    setCheckedList6(newCheckedList6);
    if (id === 1) {
      setIsComplicaciones(true);
    }
    if (id === 2) {
      setIsComplicaciones(false);
    }
  };
  //FIN DE simulador de SI NO BOTONES

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(
      createPaciente(
        nombre,
        apellido,
        cedula,
        nombrerepresentante,
        apellidorepresentante,
        cedularepresentante,
        genero,
        estadoCivil,
        Nacimiento,
        edad,
        peso,
        estatura,
        direccion,
        celular,
        telefono,
        email,
        contacto,
        alergias,
        otrasAlergias,
        isAlergicoOtros,
        antecedentesPersonales,
        antecedentesFamiliares,
        isTratadoPorMedico,
        tratadoPorEnfermedad,
        isOtraEnfermedad,
        otraEnfermedad,
        isTomaMedicamentos,
        medicamentos,
        dosismeds,
        isHabitos,
        habitos,
        motivoEstaConsulta,
        motivoUltimaConsulta,
        fechaUltimaconsulta,
        isComplicaciones,
        complicaciones,
        odontogramaUrl,
        idOdontoImgName,
        controles
      )
    );
  };

  useEffect(() => {
    if (paciente) {

      Swal.fire({
        title: "Paciente Registrado",
        imageUrl: "/tiny_logo.jpg",
        imageWidth: 70,
        imageHeight: 30,
        imageAlt: "logo",
      });
      dispatch({ type: PACIENTE_CREATE_RESET });
      dispatch({ type: CONTROL_CREATE_RESET });
      navigate("/listapacientes");
    }
  }, [dispatch, navigate, paciente]);

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) => (index === position ? !item : item));

    setCheckedState(updatedCheckedState);
    const alergiasMarcadas = updatedCheckedState.map((currentState, index) => {
      if (currentState === true) {
        return arrayAlergias[index].name;
      }
      return " ";
    });
    setAlergias(alergiasMarcadas);
  };

  const handleOnChange2 = (position) => {
    const updatedCheckedState2 = checkedState2.map((item, index) => (index === position ? !item : item));

    setCheckedState2(updatedCheckedState2);
    const backgroundMarcado = updatedCheckedState2.map((currentState, index) => {
      if (currentState === true) {
        return arrayPersonalBg[index].name;
      }
      return " ";
    });
    setAntecedentesPersonales(backgroundMarcado);
  };

  const handleOnChange3 = (position) => {
    const updatedCheckedState3 = checkedState3.map((item, index) => (index === position ? !item : item));

    setCheckedState3(updatedCheckedState3);
    const familiaresMarcado = updatedCheckedState3.map((currentState, index) => {
      if (currentState === true) {
        return arrayFamiliarBg[index].name;
      }
      return " ";
    });
    setAntecedentesFamiliares(familiaresMarcado);
  };

  function ageCalculator(edad) {
    var userinput = edad;
    var dob = new Date(userinput);
    if (userinput == null || userinput === "") {
      return false;
    } else {
      //calculate month difference from current date in time
      var month_diff = Date.now() - dob.getTime();

      //convert the calculated difference in date format
      var age_dt = new Date(month_diff);

      //extract year from date
      var year = age_dt.getUTCFullYear();

      //now calculate the age of the user
      var age = Math.abs(year - 1970);

      //display the calculated age
      setNacimiento(dob);
      setEdad(age);
      return age;
    }
  }

  return (
    <div className="main-container">
      <h1>Paciente Nuevo</h1>
      <div>
        <form id="form-paciente" onSubmit={submitHandler}>
          <div className="inputs-section">
            <div className="input-group">
              <input
                type="text"
                id="nombre"
                placeholder=" "
                className="input"
                autoComplete="off"
                maxLength={20}
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              ></input>
              <label htmlFor="nombre" className="user-label">
                Nombre
              </label>
            </div>
            <div className="input-group">
              <input
                type="text"
                id="apellido"
                placeholder=" "
                className="input"
                autoComplete="off"
                maxLength={20}
                required
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              ></input>
              <label htmlFor="apellido" className="user-label">
                Apellido
              </label>
            </div>
            <div className="input-group">
              <input
                type="text"
                id="cedula"
                placeholder=" "
                className="input"
                autoComplete="off"
                maxLength={10}
                pattern="[V|E|v|e][0-9]{6,9}"
                required
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
              ></input>
              <label htmlFor="cedula" className="user-label">
                Cedula (ej: V999999999)
              </label>
            </div>
            <div className="input-group">
              <input
                type="date"
                id="nacimiento"
                placeholder=" "
                className="input"
                min="1930-12-31"
                max="2030-12-31"
                autoComplete="off"
                onChange={(e) => ageCalculator(e.target.value)}
              ></input>
              <label htmlFor="nacimiento" className="user-label">
                Fecha Nacimiento
              </label>
            </div>
            <div className="input-group">
              <NumericFormat
                format="####-###-##-##"
                allowEmptyFormatting
                mask="_"
                type="text"
                id="telefono"
                value={celular}
                className="input"
                onChange={(e) => setCelular(e.target.value)}
              />
              <label htmlFor="telefono" className="user-label">
                Telefono
              </label>
            </div>
            <div className="input-group">
              <input
                type="text"
                id="email"
                placeholder=" "
                className="input"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
              <label htmlFor="email" className="user-label">
                Email
              </label>
            </div>
            <div className="input-group">
              <input
                type="text"
                id="direccion"
                placeholder=" "
                className="input"
                autoComplete="off"
                maxLength={100}
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
              ></input>
              <label htmlFor="direccion" className="user-label">
                Direccion
              </label>
            </div>
            <div className="input-group">
              <input
                type="text"
                id="contacto"
                placeholder=" "
                className="input"
                autoComplete="off"
                maxLength={50}
                value={contacto}
                onChange={(e) => setContacto(e.target.value)}
              ></input>
              <label htmlFor="contacto" className="user-label">
                Contacto (nombre y tlf.)
              </label>
            </div>

            <div className="input-group w40">
              <input
                type="number"
                id="peso"
                placeholder=" "
                className="input w120"
                autoComplete="off"
                max="300"
                min="5"
                value={peso}
                onChange={(e) => setPeso(e.target.value.toString())}
              ></input>
              <label htmlFor="peso" className="user-label">
                Peso (kgs)
              </label>
            </div>
            <div className="input-group w40">
              <input
                type="number"
                id="estatura"
                placeholder=" "
                className="input w120"
                autoComplete="off"
                min={"1"}
                max={"2.20"}
                step={"0.01"}
                value={estatura}
                onChange={(e) => setEstatura(e.target.value.toString())}
              ></input>
              <label htmlFor="estatura" className="user-label">
                Estatura (Mts.)
              </label>
            </div>
            <div className="select-wrapper" data-title="Genero">
              <select
                className="input select w130"
                value={genero}
                placeholder="selecionar"
                onChange={(e) => setGenero(e.target.value)}
              >
                {selGenero.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
            {genero === "Masculino" || genero === "Femenino" || genero === "" || genero === "Otro" ? (
              <div className="select-wrapper" data-title="Estado Civil">
                <select
                  value={estadoCivil}
                  className="input select w130"
                  placeholder="selecionar"
                  onChange={(e) => setEstadoCivil(e.target.value)}
                >
                  {selEdoCivil.map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              ""
            )}
          </div>
          {genero === "Niño" || genero === "Niña" ? (
            <div>
              <div className="span-historia">
                <span>Representante</span>
              </div>
              <div className="inputs-section">
                <div className="input-group">
                  <input
                    type="text"
                    id="nombrerepresentante"
                    placeholder=" "
                    className="input"
                    autoComplete="off"
                    maxLength={20}
                    value={nombrerepresentante}
                    onChange={(e) => setNombrerepresentante(e.target.value)}
                  ></input>
                  <label htmlFor="nombre" className="user-label">
                    Nombre
                  </label>
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    id="apellidorepresentante"
                    placeholder=" "
                    className="input"
                    autoComplete="off"
                    maxLength={20}
                    value={apellidorepresentante}
                    onChange={(e) => setApellidorepresentante(e.target.value)}
                  ></input>
                  <label htmlFor="apellido" className="user-label">
                    Apellido
                  </label>
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    id="cedula"
                    placeholder=" "
                    className="input"
                    autoComplete="off"
                    maxLength={10}
                    pattern="[V|E|v|e][0-9]{6,9}"
                    value={cedularepresentante}
                    onChange={(e) => setCedularepresentante(e.target.value)}
                  ></input>
                  <label htmlFor="cedula" className="user-label">
                    Cedula (ej: V999999999)
                  </label>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          <div className="span-historia">
            <span>Historia Medica</span>
          </div>
          <div className="checkboxes-section">
            <div className="radio-btn-container">
              <span className="negrita">Esta siendo tratado por un médico actualmente?</span>
              {checkedList1.map(({ id1, name1, checked1 }) => (
                <div key={id1} className="radio-btn">
                  <label key={id1}>
                    <input
                      type="radio"
                      name="options"
                      value={id1}
                      checked={checked1}
                      onChange={(e) => changeList(id1, e.target.checked)}
                    />
                  </label>
                  {name1}
                </div>
              ))}
            </div>
            {isTratadoPorMedico && (
              <div className="input-group">
                <input
                  type="text"
                  id="tratado-enfermedad"
                  placeholder=" "
                  className="input w300"
                  autoComplete="off"
                  maxLength={100}
                  value={tratadoPorEnfermedad}
                  onChange={(e) => setTratadoPorEnfermedad(e.target.value)}
                ></input>
                <label htmlFor="tratado-enfermedad" className="user-label">
                  Describa su Enfermedad
                </label>
              </div>
            )}
            <div className="radio-btn-container">
              <span className="negrita">Esta tomando algun medicamento o alguna droga?</span>
              {checkedList2.map(({ id2, name2, checked2 }) => (
                <div key={id2} className="radio-btn">
                  <label key={id2}>
                    <input
                      type="radio"
                      name="options2"
                      value={id2}
                      checked={checked2}
                      onChange={(e) => changeList2(id2, e.target.checked)}
                    />
                    {name2}
                  </label>
                </div>
              ))}
            </div>
            {isTomaMedicamentos && (
              <div>
                <div className="input-group">
                  <input
                    type="text"
                    id="nombre"
                    placeholder=" "
                    className="input w300"
                    autoComplete="off"
                    maxLength={100}
                    value={medicamentos}
                    onChange={(e) => setMedicamentos(e.target.value)}
                  ></input>
                  <label htmlFor="nombre" className="user-label">
                    Describa los Medicamentos
                  </label>
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    id="nombre"
                    placeholder=" "
                    className="input w300"
                    autoComplete="off"
                    maxLength={100}
                    value={dosismeds}
                    onChange={(e) => setDosismeds(e.target.value)}
                  ></input>
                  <label htmlFor="nombre" className="user-label">
                    Describa Las Dosis
                  </label>
                </div>
              </div>
            )}
          </div>
          <span className="titulo-de-section">Marque si es Alérgico a los Siguientes:</span>
          <div className="checkboxes-section">
            {arrayAlergias.map(({ name }, index) => {
              return (
                <div key={index} className="checkbox-div">
                  <label className="cl-checkbox">
                    <input
                      type="checkbox"
                      id={`custom-checkbox-${index}`}
                      name={name}
                      value={name}
                      checked={checkedState[index]}
                      onChange={() => handleOnChange(index)}
                    />
                    <span>{name}</span>
                  </label>
                </div>
              );
            })}
          </div>
          <div className="checkboxes-section">
            <div className="radio-btn-container">
              <span className="negrita">Es Alergico a Algún Otro Medicamento? </span>
              {checkedList3.map(({ id3, name3, checked3 }) => (
                <div key={id3} className="radio-btn">
                  <label key={id3}>
                    <input
                      type="radio"
                      name="options3"
                      value={id3}
                      checked={checked3}
                      onChange={(e) => changeList3(id3, e.target.checked)}
                    />
                  </label>
                  {name3}
                </div>
              ))}
            </div>
            {isAlergicoOtros && (
              <div className="input-group">
                <input
                  type="text"
                  id="nombre"
                  placeholder=" "
                  className="input w300"
                  autoComplete="off"
                  maxLength={100}
                  value={otrasAlergias}
                  onChange={(e) => setOtrasAlergias(e.target.value)}
                ></input>
                <label htmlFor="nombre" className="user-label">
                  Especifique
                </label>
              </div>
            )}
          </div>

          <span className="titulo-de-section">Marque solo si su Respuesta es Afirmativa:</span>
          <div className="checkboxes-section">
            {arrayPersonalBg.map(({ name }, index) => {
              return (
                <div key={index} className="checkbox-div">
                  <label className="cl-checkbox">
                    <input
                      type="checkbox"
                      id={`custom-checkbox-${index}`}
                      name={name}
                      value={name}
                      checked={checkedState2[index]}
                      onChange={() => handleOnChange2(index)}
                    />
                    <span className="texto-checkbox">{name}</span>
                  </label>
                </div>
              );
            })}
          </div>
          <div className="checkboxes-section">
            <div className="radio-btn-container">
              <span className="negrita">Posee Algún hábito? </span>
              {checkedList4.map(({ id4, name4, checked4 }) => (
                <div key={id4} className="radio-btn">
                  <label key={id4}>
                    <input
                      type="radio"
                      name="options4"
                      value={id4}
                      checked={checked4}
                      onChange={(e) => changeList4(id4, e.target.checked)}
                    />
                  </label>
                  {name4}
                </div>
              ))}
            </div>
            {isHabitos && (
              <div className="input-group">
                <input
                  type="text"
                  id="nombre"
                  placeholder=" "
                  className="input w300"
                  autoComplete="off"
                  maxLength={100}
                  value={habitos}
                  onChange={(e) => setHabitos(e.target.value)}
                ></input>
                <label htmlFor="nombre" className="user-label">
                  Especifique Cuales y Frecuencia
                </label>
              </div>
            )}
          </div>

          <span className="titulo-de-section">Algún Familiar ha Sufrido de:</span>
          <div className="checkboxes-section">
            {arrayFamiliarBg.map(({ name }, index) => {
              return (
                <div key={index} className="checkbox-div">
                  <label className="cl-checkbox">
                    <input
                      type="checkbox"
                      id={`custom-checkbox-${index}`}
                      name={name}
                      value={name}
                      checked={checkedState3[index]}
                      onChange={() => handleOnChange3(index)}
                    />
                    <span>{name}</span>
                  </label>
                </div>
              );
            })}
          </div>
          <div className="checkboxes-section">
            <div className="radio-btn-container">
              <span className="negrita">Alguna Otra Enfermedad? </span>
              {checkedList5.map(({ id5, name5, checked5 }) => (
                <div key={id5} className="radio-btn">
                  <label key={id5}>
                    <input
                      type="radio"
                      name="options5"
                      value={id5}
                      checked={checked5}
                      onChange={(e) => changeList5(id5, e.target.checked)}
                    />
                  </label>
                  {name5}
                </div>
              ))}
            </div>
            {isOtraEnfermedad && (
              <div className="input-group">
                <input
                  type="text"
                  id="nombre"
                  placeholder=" "
                  className="input w300"
                  autoComplete="off"
                  maxLength={100}
                  value={otraEnfermedad}
                  onChange={(e) => setOtraEnfermedad(e.target.value)}
                ></input>
                <label htmlFor="nombre" className="user-label">
                  Especifique
                </label>
              </div>
            )}
          </div>

          <div className="inputs-section">
            <div className="input-group">
              <input
                type="text"
                id="motivo-consulta"
                placeholder=" "
                className="input"
                autoComplete="off"
                maxLength={100}
                value={motivoEstaConsulta}
                onChange={(e) => setMotivoEstaconsulta(e.target.value)}
              ></input>
              <label htmlFor="motivo-consulta" className="user-label">
                Motivo de Esta Consulta
              </label>
            </div>
            <div className="input-group">
              <input
                type="text"
                id="fecha-ultima-consulta"
                placeholder=" "
                className="input"
                autoComplete="off"
                maxLength={50}
                value={fechaUltimaconsulta}
                onChange={(e) => setFechaUltimaconsulta(e.target.value)}
              ></input>
              <label htmlFor="fecha-ultima-consulta" className="user-label">
                Fecha Ultima Consulta
              </label>
            </div>
            <div className="input-group">
              <input
                type="text"
                id="motivo-ultima-consulta"
                placeholder=" "
                className="input"
                autoComplete="off"
                maxLength={100}
                value={motivoUltimaConsulta}
                onChange={(e) => setMotivoUltimaConsulta(e.target.value)}
              ></input>
              <label htmlFor="motivo-ultima-consulta" className="user-label">
                Motivo Ultima Consulta
              </label>
            </div>
          </div>
          <div className="checkboxes-section">
            <div className="radio-btn-container">
              <span className="negrita">Alguna Complicación Desde la Ultima Consulta? </span>
              {checkedList6.map(({ id6, name6, checked6 }) => (
                <div key={id6} className="radio-btn">
                  <label key={id6}>
                    <input
                      type="radio"
                      name="options6"
                      value={id6}
                      checked={checked6}
                      onChange={(e) => changeList6(id6, e.target.checked)}
                    />
                  </label>
                  {name6}
                </div>
              ))}
            </div>
            {isComplicaciones && (
              <div className="input-group">
                <input
                  type="text"
                  id="nombre"
                  placeholder=" "
                  className="input w300"
                  autoComplete="off"
                  maxLength={100}
                  value={complicaciones}
                  onChange={(e) => setComplicaciones(e.target.value)}
                ></input>
                <label htmlFor="nombre" className="user-label">
                  Especifique Complicaciones
                </label>
              </div>
            )}
          </div>
          <div id="btn-guardar-paciente">
            <button className="button" type="submit">
              Registrar Paciente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
