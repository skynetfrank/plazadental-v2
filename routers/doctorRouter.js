import express from "express";
import expressAsyncHandler from "express-async-handler";
import Doctor from "../models/doctor.js";
import { isAdmin, isAuth } from "../utils.js";

const doctorRouter = express.Router();

doctorRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const doctores = await Doctor.find({});
    res.send({ doctores });
  })
);

doctorRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const doctor = await Doctor.findById(req.params.id);
    if (doctor) {
      res.send(doctor);
    } else {
      res.status(404).send({ message: "Doctor No encontrado" });
    }
  })
);

doctorRouter.post(
  "/create",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const doctor = new Doctor({
      nombre: req.body.doctor.nombre,
      apellido: req.body.doctor.apellido,
      cedula: req.body.doctor.cedula,
      rif: req.body.doctor.rif,
      genero: req.body.doctor.genero,
      nacimiento: req.body.doctor.nacimiento,
      edad: req.body.doctor.edad,
      direccion: req.body.doctor.direccion,
      celular: req.body.doctor.celular,
      telefono: req.body.doctor.telefono,
      email: req.body.doctor.email,
      contacto: req.body.doctor.contacto,
      especialidad: req.body.doctor.especialidad,
      numeroColegio: req.body.doctor.numeroColegio,
      tasaComisionDoctor: req.body.doctor.tasaComision,
      fotoUrl: req.body.doctor.fotoUrl,
    });

    const createddoctor = await doctor.save();

    res.send({
      _id: createddoctor._id,
      nombre: createddoctor.nombre,
      apellido: createddoctor.apellido,
      cedula: createddoctor.cedula,
      genero: createddoctor.genero,
      nacimiento: createddoctor.nacimiento,
      direccion: createddoctor.direccion,
      celular: createddoctor.celular,
      telefono: createddoctor.telefono,
      email: createddoctor.email,
      contacto: createddoctor.contacto,
      especialidad: createddoctor.especialidad,
      numeroColegio: createddoctor.numeroColegio,
      tasaComisionDoctor: createddoctor.tasaComisionDoctor,
      fotoUrl: createddoctor.fotoUrl,
    });
  })
);

doctorRouter.put(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const doctorId = req.params.id;
    const doctor = await Doctor.findById(doctorId);
    if (doctor) {
      doctor.nombre = req.body.nombre;
      doctor.apellido = req.body.apellido;
      doctor.cedula = req.body.cedula;
      doctor.genero = req.body.genero;
      doctor.nacimiento = req.body.nacimiento;
      doctor.estadoCivil = req.body.estadoCivil;
      doctor.direccion = req.body.direccion;
      doctor.celular = req.body.celular;
      doctor.telefono = req.body.telefono;
      doctor.email = req.body.email;
      doctor.contacto = req.body.contacto;
      doctor.especialidad = req.body.especialidad;
      doctor.numeroColegio = req.body.numeroColegio;
      doctor.tasaComisionDoctor = req.body.tasaComisionDoctor;
      doctor.fotoUrl = req.body.fotoUrl;

      const updateddoctor = await doctor.save();
      res.send({ message: "Doctor Actualizado", doctor: updateddoctor });
    } else {
      res.status(404).send({ message: "Doctor no Encontrado" });
    }
  })
);

doctorRouter.delete(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const doctor = await Doctor.findById(req.params.id);
    if (doctor) {
      const deletedoctor = await doctor.remove();
      res.send({ message: "Doctor Eliminado", doctor: deletedoctor });
    } else {
      res.status(404).send({ message: "Doctor No Encontrado" });
    }
  })
);

export default doctorRouter;
