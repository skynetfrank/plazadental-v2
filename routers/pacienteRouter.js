import express from "express";
import expressAsyncHandler from "express-async-handler";
import Paciente from "../models/paciente.js";
import Control from "../models/control.js";
import { isAdmin, isAuth } from "../utils.js";
import mongoose from "mongoose";

const pacienteRouter = express.Router();

pacienteRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;

    const busqueda = req.query.busqueda || "";
    const searcherFilter = busqueda ? { searchstring: { $regex: busqueda, $options: "i" } } : {};

    const count = await Paciente.countDocuments({
      ...searcherFilter,
    });

    const pacientes = await Paciente.find({
      ...searcherFilter,
    })
      .sort({ nombre: 1 })
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    res.send({ pacientes, page, pages: Math.ceil(count / pageSize), count });
  })
);

pacienteRouter.get(
  "/all",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const fecha1 = req.query.fecha1;
    const fecha2 = req.query.fecha2;
    const dia = Number(fecha1.substr(8, 2));
    const mes = Number(fecha1.substr(5, 2));
    const ano = Number(fecha1.substr(0, 4));

    const dia2 = Number(fecha2.substr(8, 2));
    const mes2 = Number(fecha2.substr(5, 2));
    const ano2 = Number(fecha2.substr(0, 4));

    const count = await Paciente.countDocuments({});
    const pacientes = await Paciente.aggregate([
      {
        $project: {
          _id: 1,
          codigo: 1,
          ubicacion: 1,
          nombre: 1,
          marca: 1,
          presentacion: 1,
          unidades: 1,
          vehiculo: 1,
          modelos: 1,
          years: 1,
          motores: 1,
          tags: 1,
          categoria: 1,
          descripcion: 1,
          existencia: 1,
          reposicion: 1,
          costobs: 1,
          costousd: 1,
          preciobs: 1,
          preciousd: 1,
          proveedor: 1,
          imageurl: 1,
          createdAt: 1,
          day: { $dayOfMonth: "$createdAt" },
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
          fecha: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        },
      },
      {
        $match: {
          day: { $gte: dia },
          month: { $gte: mes },
          year: { $gte: ano },
        },
      },
    ])
      .match({
        day: { $lte: dia2 },
        month: { $lte: mes2 },
        year: { $lte: ano2 },
      })
      .sort({ createdAt: -1 });
    res.send({ pacientes });
  })
);

pacienteRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const paciente = await Paciente.findById(req.params.id)
      .populate({
        path: "controles.control",
        // Get friends of friends - populate the 'friends' array for every friend
        populate: { path: "serviciosItems.servicio" },
      })
      .populate({
        path: "controles.control",
        // Get friends of friends - populate the 'friends' array for every friend
        populate: { path: "doctor" },
      });

    if (paciente) {
      res.send(paciente);
    } else {
      res.status(404).send({ message: "Paciente No encontrado" });
    }
  })
);

pacienteRouter.post(
  "/create",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const paciente = new Paciente({
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      cedula: req.body.cedula,
      nombrerepresentante: req.body.nombrerepresentante,
      apellidorepresentante: req.body.apellidorepresentante,
      cedularepresentante: req.body.cedularepresentante,
      genero: req.body.genero,
      estadoCivil: req.body.estadoCivil,
      Nacimiento: req.body.Nacimiento,
      edad: req.body.edad,
      peso: req.body.peso,
      estatura: req.body.estatura,
      direccion: req.body.direccion,
      celular: req.body.celular,
      telefono: req.body.telefono,
      email: req.body.email,
      contacto: req.body.contacto,
      alergias: req.body.alergias,
      otrasAlergias: req.body.otrasAlergias,
      isAlergicoOtros: req.body.isAlergicoOtros,
      antecedentesPersonales: req.body.antecedentesPersonales,
      antecedentesFamiliares: req.body.antecedentesFamiliares,
      isTratadoPorMedico: req.body.isTratadoPorMedico,
      tratadoPorEnfermedad: req.body.tratadoPorEnfermedad,
      isOtraEnfermedad: req.body.isOtraEnfermedad,
      otraEnfermedad: req.body.otraEnfermedad,
      isTomaMedicamentos: req.body.isTomaMedicamentos,
      medicamentos: req.body.medicamentos,
      dosismeds: req.body.dosismeds,
      habitos: req.body.habitos,
      isHabitos: req.body.isHabitos,
      motivoEstaConsulta: req.body.motivoEstaConsulta,
      motivoUltimaConsulta: req.body.motivoUltimaConsulta,
      fechaUltimaconsulta: req.body.fechaUltimaconsulta,
      isComplicaciones: req.body.isComplicaciones,
      complicaciones: req.body.complicaciones,
      odontogramaUrl: req.body.odontogramaUrl,
      idOdontoImgName: req.body.idOdontoImgName,
      idPacienteOld: req.body.idPacienteOld,
    });
    const createdpaciente = await paciente.save();
    res.send({
      _id: createdpaciente._id,
      nombre: createdpaciente.nombre,
      apellido: createdpaciente.apellido,
      cedula: createdpaciente.cedula,
      nombrerepresentante: createdpaciente.nombrerepresentante,
      apellidorepresentante: createdpaciente.apellidorepresentante,
      cedularepresentante: createdpaciente.cedularepresentante,
      genero: createdpaciente.genero,
      estadoCivil: createdpaciente.estadoCivil,
      Nacimiento: createdpaciente.Nacimiento,
      edad: createdpaciente.edad,
      peso: createdpaciente.peso,
      direccion: createdpaciente.direccion,
      celular: createdpaciente.celular,
      telefono: createdpaciente.telefono,
      email: createdpaciente.email,
      contacto: createdpaciente.contacto,
      alergias: createdpaciente.alergias,
      otrasAlergias: createdpaciente.otrasAlergias,
      isAlergicoOtros: createdpaciente.isAlergicoOtros,
      antecedentesPersonales: createdpaciente.antecedentesPersonales,
      antecedentesFamiliares: createdpaciente.antecedentesFamiliares,
      isTratadoPorMedico: createdpaciente.isTratadoPorMedico,
      tratadoPorEmfermedad: createdpaciente.tratadoPorEnfermedad,
      isOtraEnfermedad: createdpaciente.isOtraEnfermedad,
      otraEnfermedad: createdpaciente.otraEnfermedad,
      isTomaMedicamentos: createdpaciente.isTomaMedicamentos,
      medicamentos: createdpaciente.medicamentos,
      dosisMeds: createdpaciente.dosisMeds,
      habitos: createdpaciente.habitos,
      isHabitos: createdpaciente.isHabitos,
      motivoEstaConsulta: createdpaciente.motivoEstaConsulta,
      motivoUltimaConsulta: createdpaciente.motivoUltimaConsulta,
      fechaUltimaconsulta: createdpaciente.fechaUltimaconsulta,
      isComplicaciones: createdpaciente.isComplicaciones,
      complicaciones: createdpaciente.complicaciones,
      odontogramaUrl: createdpaciente.odontogramaUrl,
      idOdontoImgName: createdpaciente.idOdontoImgName,
      idPacienteOld: createdpaciente.idPacienteOld,
    });
  })
);

pacienteRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const pacienteId = req.params.id;
    const paciente = await Paciente.findById(pacienteId);
    if (paciente) {
      paciente.nombre = req.body.nombre;
      paciente.apellido = req.body.apellido;
      paciente.cedula = req.body.cedula;
      paciente.nombrerepresentante = req.body.nombrerepresentante;
      paciente.apellidorepresentante = req.body.apellidorepresentante;
      paciente.cedularepresentante = req.body.cedularepresentante;
      paciente.genero = req.body.genero;
      paciente.estadoCivil = req.body.estadoCivil;
      paciente.Nacimiento = req.body.Nacimiento;
      paciente.edad = req.body.edad;
      paciente.peso = req.body.peso;
      paciente.estatura = req.body.estatura;
      paciente.direccion = req.body.direccion;
      paciente.celular = req.body.celular;
      paciente.telefono = req.body.telefono;
      paciente.email = req.body.email;
      paciente.contacto = req.body.contacto;
      paciente.alergias = req.body.alergias;
      paciente.otrasAlergias = req.body.otrasAlergias;
      paciente.isAlergicoOtros = req.body.isAlergicoOtros;
      paciente.antecedentesPersonales = req.body.antecedentesPersonales;
      paciente.antecedentesFamiliares = req.body.antecedentesFamiliares;
      paciente.isTratadoPorMedico = req.body.isTratadoPorMedico;
      paciente.tratadoPorEnfermedad = req.body.tratadoPorEnfermedad;
      paciente.otraEnfermedad = req.body.otraEnfermedad;
      paciente.isTomaMedicamentos = req.body.isTomaMedicamentos;
      paciente.medicamentos = req.body.medicamentos;
      paciente.dosismeds = req.body.dosismeds;
      paciente.habitos = req.body.habitos;
      paciente.isHabitos = req.body.isHabitos;
      paciente.motivoEstaConsulta = req.body.motivoEstaConsulta;
      paciente.motivoUltimaConsulta = req.body.motivoUltimaConsulta;
      paciente.fechaUltimaconsulta = req.body.fechaUltimaconsulta;
      paciente.isComplicaciones = req.body.isComplicaciones;
      paciente.complicaciones = req.body.complicaciones;
      paciente.odontogramaUrl = req.body.odontogramaUrl;
      const buscador = req.body.nombre.concat(
        " ",
        req.body.apellido,
        " ",
        req.body.cedula,
        " ",
        req.body.nombrerepresentante,
        " ",
        req.body.apellidorepresentante,
        " ",
        req.body.cedularepresentante,
        " ",
        req.body.direccion,
        " ",
        req.body.celular,
        " ",
        req.body.telefono,
        " ",
        req.body.email,
        " ",
        req.body.contacto,
        " ",
        req.body.tratadoPorEnfermedad,
        " ",
        req.body.otraEnfermedad,
        " ",
        req.body.medicamentos,
        " ",
        req.body.genero,
        " ",
        req.body.estadoCivil,
        " ",
        req.body.alergias.map((item) => item + " "),
        " ",
        req.body.antecedentesPersonales.map((item) => item + " "),
        " ",
        req.body.antecedentesFamiliares.map((item) => item + " "),
        " ",
        req.body.Nacimiento.toString()
      );
      paciente.searchstring = buscador;
      const updatedpaciente = await paciente.save();
      res.send({ message: "Paciente Actualizado", Paciente: updatedpaciente });
    } else {
      res.status(404).send({ message: "Paciente no Encontrado" });
    }
  })
);

pacienteRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const paciente = await Paciente.findById(req.params.id);
    if (paciente) {
      const deletepaciente = await paciente.remove();
      res.send({ message: "Paciente Eliminado", paciente: deletepaciente });
    } else {
      res.status(404).send({ message: "Paciente No Encontrado" });
    }
  })
);

pacienteRouter.put(
  "/addcontrol/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const pacienteId = req.params.id;
    const controlId = req.body.controlID;
    const objControl = { control: controlId };
    const paciente = { _id: pacienteId };

    let updatedPaciente = await Paciente.findByIdAndUpdate(
      paciente,
      { $addToSet: { controles: objControl } },
      { new: true }
    );

    /*    Paciente.findOneAndUpdate(
      { _id: pacienteId },
      { $push: { 'controles.control': controlId } },
      { upsert: true, new: true, runValidators: true }
    ); */
    res.send({
      message: "Control Agregado al Paciente",
      paciente: updatedPaciente,
    });

    /* const paciente = await Paciente.findById(pacienteId);
    if (paciente) {
      paciente.controles = req.body.controlId;
      const updatedpaciente = await paciente.save();
      res.send({
        message: 'Control Agregado al Paciente',
        Paciente: updatedpaciente,
      });
    } else {
      res.status(404).send({ message: 'Paciente no Encontrado' });
    } */
  })
);

pacienteRouter.put(
  "/deletecontrol/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const pacienteId = req.params.id;
    const controlId = req.body.controlID;
    const objControl = { control: controlId };
    const paciente = { _id: pacienteId };
    let updatedPaciente = await Paciente.findByIdAndUpdate(paciente, {
      $pull: { controles: objControl },
    });

    /*    Paciente.findOneAndUpdate(
      { _id: pacienteId },
      { $push: { 'controles.control': controlId } },
      { upsert: true, new: true, runValidators: true }
    ); */
    res.send({
      message: "Control Eliminado al Paciente",
      paciente: updatedPaciente,
    });

    /* const paciente = await Paciente.findById(pacienteId);
    if (paciente) {
      paciente.controles = req.body.controlId;
      const updatedpaciente = await paciente.save();
      res.send({
        message: 'Control Agregado al Paciente',
        Paciente: updatedpaciente,
      });
    } else {
      res.status(404).send({ message: 'Paciente no Encontrado' });
    } */
  })
);

export default pacienteRouter;
