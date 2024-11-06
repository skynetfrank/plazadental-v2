import mongoose from "mongoose";

const pacienteSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    cedula: { type: String },
    nombrerepresentante: { type: String },
    apellidorepresentante: { type: String },
    cedularepresentante: { type: String },
    genero: { type: String },
    estadoCivil: { type: String },
    Nacimiento: { type: Date },
    edad: { type: String },
    peso: { type: String },
    estatura: { type: String },
    direccion: { type: String },
    celular: { type: String },
    telefono: { type: String },
    email: { type: String },
    contacto: { type: String },
    alergias: { type: [] },
    isAlergicoOtros: { type: Boolean, default: false },
    otrasAlergias: { type: String },
    antecedentesPersonales: { type: [] },
    antecedentesFamiliares: { type: [] },
    isTratadoPorMedico: { type: Boolean, default: false },
    tratadoPorEnfermedad: { type: String },
    isOtraEnfermedad: { type: Boolean, default: false },
    otraEnfermedad: { type: String },
    isTomaMedicamentos: { type: Boolean, default: false },
    medicamentos: { type: String },
    dosismeds: { type: String },
    habitos: { type: String },
    isHabitos: { type: Boolean, default: false },
    motivoEstaConsulta: { type: String },
    motivoUltimaConsulta: { type: String },
    fechaUltimaconsulta: { type: String },
    isComplicaciones: { type: Boolean, default: false },
    complicaciones: { type: String },
    odontogramaUrl: { type: String },
    idOdontoImgName: { type: String },
    idPacienteOld: { type: String, default: "" },
    controles: [
      {
        control: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Control",
        },
      },
    ],
    searchstring: {
      type: String,
      default: function () {
        return this.nombre.concat(
          " ",
          this.apellido,
          " ",
          this.cedula,
          " ",
          this.direccion,
          " ",
          this.celular,
          " ",
          this.telefono,
          " ",
          this.email,
          " ",
          this.contacto,
          " ",
          this.tratadoPorEnfermedad,
          " ",
          this.otraEnfermedad,
          " ",
          this.medicamentos,
          " ",
          this.genero,
          " ",
          this.estadoCivil,
          " ",
          this.alergias.map((item) => item + " "),
          " ",
          this.antecedentesPersonales.map((item) => item + " "),
          " ",
          this.antecedentesFamiliares.map((item) => item + " "),
          " ",
          this.Nacimiento
        );
      },
    },
    migraId: { type: String },
  },
  {
    timestamps: true,
  }
);
const Paciente = mongoose.model("Paciente", pacienteSchema);
export default Paciente;

/* nombre
    apellido
    cedula
    genero
    estadoCivil
    Nacimiento
    edad
    peso
    estatura
    direccion
    celular
    telefono
    email
    contacto
    alergias
    otrasAlergias
    antecedentesPersonales
    antecedentesFamiliares
    isTratadoPorMedico
    tratadoPorEnfermedad
    otraEnfermedad
    isTomaMedicamentos
    medicamentos
    dosismeds
    habitos
    motivoEstaConsulta
    motivoUltimaConsulta
    fechaUltimaconsulta
    isComplicaciones
    complicaciones
    odontogramaUrl
    idOdontoImgName
    idPacienteOld
    controles */
