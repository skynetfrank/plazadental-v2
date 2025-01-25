import express from "express";
import expressAsyncHandler from "express-async-handler";
import Control from "../models/control.js";
import Paciente from "../models/paciente.js";
import { isAdmin, isAuth } from "../utils.js";

import mongoose from "mongoose";

const controlRouter = express.Router();

controlRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const controles = await Control.find(
      {},
      { fechaControl: 1, paciente: 1, montoUsd: 1, evaluacion: 1, tratamiento: 1 }
    )
      .populate({
        path: "paciente",
        select: "nombre apellido",
      })
      .sort({ fechaControl: -1 });
    res.send({ controles });
  })
);

controlRouter.get(
  "/summary",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const controls = await Control.aggregate([
      {
        $group: {
          _id: null,
          numControls: { $sum: 1 },
          totalSales: { $sum: "$subtotal" },
        },
      },
    ]);

    const dailyControls = await Control.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          controls: { $sum: 1 },
          sales: { $sum: "$subtotal" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.send({
      controls,
      dailyControls,
    });
  })
);

controlRouter.get(
  "/consolidadoventas",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const fecha1 = req.query.fecha1;
    const fecha2 = req.query.fecha2;

    const ventas = await Control.aggregate([
      {
        $project: {
          _id: 1,
          paciente: 1,
          doctor: 1,
          user: 1,
          fechaControl: 1,
          serviciosItems: 1,
          laboratorio: 1,
          montoServicios: 1,
          montoLab: 1,
          descuento: 1,
          montoUsd: 1,
          tasaComisionDr: 1,
          tasaComisionPlaza: 1,
          montoComisionDr: 1,
          montoComisionPlaza: 1,
          day: { $dayOfMonth: "$fechaControl" },
          month: { $month: "$fechaControl" },
          year: { $year: "$fechaControl" },
          fecha: { $dateToString: { format: "%Y-%m-%d", date: "$fechaControl" } },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "usuario",
        },
      },
      {
        $unwind: "$usuario",
      },
      {
        $project: {
          _id: 1,
          paciente: 1,
          doctor: 1,
          fechaControl: 1,
          serviciosItems: 1,
          laboratorio: 1,
          montoServicios: 1,
          montoLab: 1,
          descuento: 1,
          montoUsd: 1,
          tasaComisionDr: 1,
          tasaComisionPlaza: 1,
          montoComisionDr: 1,
          montoComisionPlaza: 1,
          day: { $dayOfMonth: "$fechaControl" },
          month: { $month: "$fechaControl" },
          year: { $year: "$fechaControl" },
          fecha: { $dateToString: { format: "%Y-%m-%d", date: "$fechaControl" } },
          usuario: { $toString: "$usuario.nombre" },
        },
      },
      {
        $lookup: {
          from: "pacientes",
          localField: "paciente",
          foreignField: "_id",
          as: "pacientex",
        },
      },
      {
        $unwind: "$pacientex",
      },
      {
        $project: {
          _id: 1,
          paciente: 1,
          doctor: 1,
          fechaControl: 1,
          serviciosItems: 1,
          laboratorio: 1,
          montoServicios: 1,
          montoLab: 1,
          descuento: 1,
          montoUsd: 1,
          tasaComisionDr: 1,
          tasaComisionPlaza: 1,
          montoComisionDr: 1,
          montoComisionPlaza: 1,
          day: { $dayOfMonth: "$fechaControl" },
          month: { $month: "$fechaControl" },
          year: { $year: "$fechaControl" },
          fecha: { $dateToString: { format: "%Y-%m-%d", date: "$fechaControl" } },
          usuario: { $toString: "$usuario.nombre" },
          nombrePaciente: { $toString: "$pacientex.nombre" },
          apellidoPaciente: { $toString: "$pacientex.apellido" },
          cedulaPaciente: { $toString: "$pacientex.cedula" },
        },
      },
      {
        $lookup: {
          from: "doctors",
          localField: "doctor",
          foreignField: "_id",
          as: "doctorx",
        },
      },
      {
        $unwind: "$doctorx",
      },
      {
        $project: {
          _id: 1,
          paciente: 1,
          doctor: 1,
          fechaControl: 1,
          serviciosItems: 1,
          laboratorio: 1,
          montoServicios: 1,
          montoLab: 1,
          descuento: 1,
          montoUsd: 1,
          tasaComisionDr: 1,
          tasaComisionPlaza: 1,
          montoComisionDr: 1,
          montoComisionPlaza: 1,
          day: { $dayOfMonth: "$fechaControl" },
          month: { $month: "$fechaControl" },
          year: { $year: "$fechaControl" },
          fecha: { $dateToString: { format: "%Y-%m-%d", date: "$fechaControl" } },
          usuario: { $toString: "$usuario.nombre" },
          nombrePaciente: 1,
          apellidoPaciente: 1,
          cedulaPaciente: 1,
          nombreDoctor: { $toString: "$doctorx.nombre" },
          apellidoDoctor: { $toString: "$doctorx.apellido" },
        },
      },
      {
        $match: {
          fecha: { $gte: fecha1 },
        },
      },
      {
        $match: {
          fecha: { $lte: fecha2 },
        },
      },
    ]).sort({ fecha: -1 });
    res.send(ventas);
  })
);

controlRouter.get(
  "/groupedbyday",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const dia = Number(31);
    const mes = Number(12);
    const ano = Number(2024);
    const dailyControles = await Control.aggregate([
      {
        $project: {
          fechaControl: 1,
          paciente: 1,
          doctor: 1,
          serviciosItems: 1,
          cambioBcv: 1,
          montoUsd: 1,
          montoComisionDr: 1,
          montoComisionPlaza: 1,
          pago: 1,
          day: { $dayOfMonth: "$fechaControl" },
          month: { $month: "$fechaControl" },
          year: { $year: "$fechaControl" },
          fecha: { $dateToString: { format: "%Y-%m-%d", date: "$fechaControl" } },
        },
      },

      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$fechaControl" } },
          controles: { $sum: 1 },
          monto: { $sum: "$montoUsd" },
        },
      },

      { $sort: { _id: -1 } },
    ]);

    res.send(dailyControles);
  })
);

controlRouter.get(
  "/cuadrediario",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const fecha1 = req.query.fecha;
    const dia = Number(fecha1.substr(8, 2));
    const mes = Number(fecha1.substr(5, 2));
    const ano = Number(fecha1.substr(0, 4));

    const count = await Control.countDocuments({});

    const controles = await Control.aggregate([
      {
        $project: {
          _id: 1,
          fechaControl: 1,
          paciente: 1,
          doctor: 1,
          serviciosItems: 1,
          laboratorio: 1,
          montoLab: 1,
          montoServicios: 1,
          descuento: 1,
          montoComisionDr: 1,
          montoComisionPlaza: 1,
          cambioBcv: 1,
          montoUsd: 1,
          pago: 1,
          createdAt: 1,
          day: { $dayOfMonth: "$fechaControl" },
          month: { $month: "$fechaControl" },
          year: { $year: "$fechaControl" },
          fecha: { $dateToString: { format: "%Y-%m-%d", date: "$fechaControl" } },
        },
      },
      {
        $lookup: {
          from: "servicios",
          localField: "serviciosItems.servicio",
          foreignField: "_id",
          as: "servicio_data",
        },
      },

      {
        $lookup: {
          from: "doctors",
          localField: "doctor",
          foreignField: "_id",
          as: "doctor_data",
        },
      },
      {
        $unwind: "$doctor_data",
      },
      {
        $lookup: {
          from: "pacientes",
          localField: "paciente",
          foreignField: "_id",
          as: "paciente_data",
        },
      },
      {
        $unwind: "$paciente_data",
      },
      {
        $match: {
          day: { $eq: dia },
          month: { $eq: mes },
          year: { $eq: ano },
        },
      },
    ]).sort({ fecha: 1 });

    const cash = await Control.aggregate([
      {
        $project: {
          fechaControl: 1,
          pago: 1,
          createdAt: 1,
          day: { $dayOfMonth: "$fechaControl" },
          month: { $month: "$fechaControl" },
          year: { $year: "$fechaControl" },
          fecha: { $dateToString: { format: "%Y-%m-%d", date: "$fechaControl" } },
        },
      },
      {
        $match: {
          day: { $eq: dia },
          month: { $eq: mes },
          year: { $eq: ano },
        },
      },
      {
        $group: {
          _id: null,
          totalCashusd: { $sum: "$pago.efectivousd" },
          totalCashbs: { $sum: "$pago.efectivobs" },
          totalCasheuros: { $sum: "$pago.efectivoeuros" },
          totalpagomobil: { $sum: "$pago.pagomovil.montopagomovil" },
          totalzelle: { $sum: "$pago.zelle.montozelle" },
          totalcashea: { $sum: "$pago.cashea.monto" },
        },
      },
    ]);

    const puntoPlz = await Control.aggregate([
      {
        $project: {
          fechaControl: 1,
          pago: 1,
          createdAt: 1,
          day: { $dayOfMonth: "$fechaControl" },
          month: { $month: "$fechaControl" },
          year: { $year: "$fechaControl" },
          fecha: { $dateToString: { format: "%Y-%m-%d", date: "$fechaControl" } },
          banco: "$pago.punto.bancodestinopunto",
        },
      },
      {
        $match: {
          day: { $eq: dia },
          month: { $eq: mes },
          year: { $eq: ano },
        },
      },
      {
        $match: {
          banco: { $eq: "Plaza" },
        },
      },
      {
        $group: {
          _id: null,
          totalpuntoplaza: { $sum: "$pago.punto.montopunto" },
        },
      },
    ]);

    const puntoPlz2 = await Control.aggregate([
      {
        $project: {
          fechaControl: 1,
          pago: 1,
          createdAt: 1,
          day: { $dayOfMonth: "$fechaControl" },
          month: { $month: "$fechaControl" },
          year: { $year: "$fechaControl" },
          fecha: { $dateToString: { format: "%Y-%m-%d", date: "$fechaControl" } },
          banco: "$pago.punto.bancodestinopunto2",
        },
      },
      {
        $match: {
          day: { $eq: dia },
          month: { $eq: mes },
          year: { $eq: ano },
        },
      },
      {
        $match: {
          banco: { $eq: "Plaza" },
        },
      },
      {
        $group: {
          _id: null,
          totalpuntoplaza: { $sum: "$pago.punto.montopunto2" },
        },
      },
    ]);

    const puntoPlz3 = await Control.aggregate([
      {
        $project: {
          fechaControl: 1,
          pago: 1,
          createdAt: 1,
          day: { $dayOfMonth: "$fechaControl" },
          month: { $month: "$fechaControl" },
          year: { $year: "$fechaControl" },
          fecha: { $dateToString: { format: "%Y-%m-%d", date: "$fechaControl" } },
          banco: "$pago.punto.bancodestinopunto3",
        },
      },
      {
        $match: {
          day: { $eq: dia },
          month: { $eq: mes },
          year: { $eq: ano },
        },
      },
      {
        $match: {
          banco: { $eq: "Plaza" },
        },
      },
      {
        $group: {
          _id: null,
          totalpuntoplaza: { $sum: "$pago.punto.montopunto3" },
        },
      },
    ]);

    const puntoVzl = await Control.aggregate([
      {
        $project: {
          fechaControl: 1,
          pago: 1,
          createdAt: 1,
          day: { $dayOfMonth: "$fechaControl" },
          month: { $month: "$fechaControl" },
          year: { $year: "$fechaControl" },
          fecha: { $dateToString: { format: "%Y-%m-%d", date: "$fechaControl" } },
          banco: "$pago.punto.bancodestinopunto",
        },
      },
      {
        $match: {
          day: { $eq: dia },
          month: { $eq: mes },
          year: { $eq: ano },
        },
      },
      {
        $match: {
          banco: { $eq: "Venezuela" },
        },
      },
      {
        $group: {
          _id: null,
          totalpuntovzla: { $sum: "$pago.punto.montopunto" },
        },
      },
    ]);

    const puntoVzl2 = await Control.aggregate([
      {
        $project: {
          fechaControl: 1,
          pago: 1,
          createdAt: 1,
          day: { $dayOfMonth: "$fechaControl" },
          month: { $month: "$fechaControl" },
          year: { $year: "$fechaControl" },
          fecha: { $dateToString: { format: "%Y-%m-%d", date: "$fechaControl" } },
          banco: "$pago.punto.bancodestinopunto2",
        },
      },
      {
        $match: {
          day: { $eq: dia },
          month: { $eq: mes },
          year: { $eq: ano },
        },
      },
      {
        $match: {
          banco: { $eq: "Venezuela" },
        },
      },
      {
        $group: {
          _id: null,
          totalpuntovzla: { $sum: "$pago.punto.montopunto2" },
        },
      },
    ]);

    const puntoVzl3 = await Control.aggregate([
      {
        $project: {
          fechaControl: 1,
          pago: 1,
          createdAt: 1,
          day: { $dayOfMonth: "$fechaControl" },
          month: { $month: "$fechaControl" },
          year: { $year: "$fechaControl" },
          fecha: { $dateToString: { format: "%Y-%m-%d", date: "$fechaControl" } },
          banco: "$pago.punto.bancodestinopunto3",
        },
      },
      {
        $match: {
          day: { $eq: dia },
          month: { $eq: mes },
          year: { $eq: ano },
        },
      },
      {
        $match: {
          banco: { $eq: "Venezuela" },
        },
      },
      {
        $group: {
          _id: null,
          totalpuntovzla: { $sum: "$pago.punto.montopunto3" },
        },
      },
    ]);

    const puntobanes = await Control.aggregate([
      {
        $project: {
          fechaControl: 1,
          pago: 1,
          createdAt: 1,
          day: { $dayOfMonth: "$fechaControl" },
          month: { $month: "$fechaControl" },
          year: { $year: "$fechaControl" },
          fecha: { $dateToString: { format: "%Y-%m-%d", date: "$fechaControl" } },
          banco: "$pago.punto.bancodestinopunto",
        },
      },
      {
        $match: {
          day: { $eq: dia },
          month: { $eq: mes },
          year: { $eq: ano },
        },
      },
      {
        $match: {
          banco: { $eq: "Banesco" },
        },
      },
      {
        $group: {
          _id: null,
          totalpuntobanes: { $sum: "$pago.punto.montopunto" },
        },
      },
    ]);

    const puntobanes2 = await Control.aggregate([
      {
        $project: {
          fechaControl: 1,
          pago: 1,
          createdAt: 1,
          day: { $dayOfMonth: "$fechaControl" },
          month: { $month: "$fechaControl" },
          year: { $year: "$fechaControl" },
          fecha: { $dateToString: { format: "%Y-%m-%d", date: "$fechaControl" } },
          banco: "$pago.punto.bancodestinopunto2",
        },
      },
      {
        $match: {
          day: { $eq: dia },
          month: { $eq: mes },
          year: { $eq: ano },
        },
      },
      {
        $match: {
          banco: { $eq: "Banesco" },
        },
      },
      {
        $group: {
          _id: null,
          totalpuntobanes: { $sum: "$pago.punto.montopunto2" },
        },
      },
    ]);

    const puntobanes3 = await Control.aggregate([
      {
        $project: {
          fechaControl: 1,
          pago: 1,
          createdAt: 1,
          day: { $dayOfMonth: "$fechaControl" },
          month: { $month: "$fechaControl" },
          year: { $year: "$fechaControl" },
          fecha: { $dateToString: { format: "%Y-%m-%d", date: "$fechaControl" } },
          banco: "$pago.punto.bancodestinopunto3",
        },
      },
      {
        $match: {
          day: { $eq: dia },
          month: { $eq: mes },
          year: { $eq: ano },
        },
      },
      {
        $match: {
          banco: { $eq: "Banesco" },
        },
      },
      {
        $group: {
          _id: null,
          totalpuntobanes: { $sum: "$pago.punto.montopunto3" },
        },
      },
    ]);

    const puntoPlaza = [...puntoPlz, ...puntoPlz2, ...puntoPlz3];
    const puntoVenezuela = [...puntoVzl, ...puntoVzl2, ...puntoVzl3];
    const puntoBanesco = [...puntobanes, ...puntobanes2, ...puntobanes3];
    console.log("punto plaza:", puntoPlaza);
    console.log("punto banesco:", puntoBanesco);
    console.log("punto plaza:", puntoVenezuela);
    res.send({ controles, cash, puntoPlaza, puntoVenezuela, puntoBanesco });
  })
);

controlRouter.post(
  "/create",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const control = new Control({
      paciente: req.body.pacienteId,
      doctor: req.body.doctorId,
      user: req.body.user,
      fechaControl: req.body.fechaControl,
      esCita1: req.body.esCita1,
      evaluacion: req.body.evaluacion,
      tratamiento: req.body.tratamiento,
      recipe: req.body.recipe,
      indicaciones: req.body.indicaciones,
      serviciosItems: req.body.serviciosItems,
      materiales: req.body.materiales,
      cambioBcv: req.body.cambioBcv,
      montoServicios: req.body.montoServicios,
      abonos: req.body.abonos,
      formaPago: req.body.formaPago,
      condiciones: req.body.condiciones,
      montoUsd: req.body.montoUsd,
      montoBs: req.body.montoBs,
      tasaIva: req.body.tasaIva,
      montoIva: req.body.montoIva,
      descuento: req.body.descuento,
      laboratorio: req.body.laboratorio,
      montoLab: req.body.montoLab,
      conceptoLaboratorio: req.body.conceptoLaboratorio,
      tasaComisionDr: req.body.tasaComisionDr,
      tasaComisionPlaza: req.body.tasaComisionPlaza,
      montoComisionDr: req.body.montoComisionDr,
      montoComisionPlaza: req.body.montoComisionPlaza,
      pago: req.body.pago,
      factura: req.body.factura,
      facturaControl: req.body.facturacontrol,
      fechaFactura: req.body.fechaFactura,
    });

    const createdcontrol = await control.save();
    if (createdcontrol) {
      const objControl = { control: createdcontrol._id };
      let updatedPaciente = await Paciente.findByIdAndUpdate(
        createdcontrol.paciente,
        { $addToSet: { controles: objControl } },
        { new: true }
      );
      res.send({
        _id: createdcontrol._id,
        paciente: createdcontrol.paciente,
        doctor: createdcontrol.doctor,
        user: createdcontrol.user,
        fechaControl: createdcontrol.fechaControl,
        updatedPaciente: updatedPaciente.controles,
        abonos: createdcontrol.abonos,
      });
    }
  })
);

controlRouter.put(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const controlId = req.params.id;
    const control = await Control.findById(controlId);
    if (control) {
      control.doctor = req.body.doctorId;
      control.user = req.body.user;
      control.fechaControl = req.body.fechaControl;
      control.evaluacion = req.body.evaluacion;
      control.tratamiento = req.body.tratamiento;
      control.recipe = req.body.recipe;
      control.indicaciones = req.body.indicaciones;
      control.serviciosItems = req.body.serviciosItems;
      control.cambioBcv = req.body.cambioBcv;
      control.montoServicios = req.body.montoServicios;
      control.montoUsd = req.body.montoUsd;
      control.montoBs = req.body.montoBs;
      control.tasaIva = req.body.tasaIva;
      control.montoIva = req.body.montoIva;
      control.descuento = req.body.descuento;
      control.laboratorio = req.body.laboratorio;
      control.montoLab = req.body.montoLab;
      control.conceptoLaboratorio = req.body.conceptoLaboratorio;
      control.tasaComisionDr = req.body.tasaComisionDr;
      control.tasaComisionPlaza = req.body.tasaComisionPlaza;
      control.montoComisionDr = req.body.montoComisionDr;
      control.montoComisionPlaza = req.body.montoComisionPlaza;
      control.pago = req.body.pago;
      control.abonos = req.body.abonos;
      control.condiciones = req.body.condiciones;
      control.formaPago = req.body.formaPago;
      const updatedControl = await control.save();
      res.send({ message: "Control Actualizado", control: updatedControl });
    } else {
      res.status(404).send({ message: "Control no Encontrado" });
    }
  })
);

controlRouter.put(
  "/:id/abono",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const control = await Control.findById(req.params.id);
    if (control) {
      control.isPaid = true;
      order.abonos = {
        fecha: req.body.fecha,
        monto: req.body.monto,
      };
      const updatedControl = await order.save();
      res.send({ message: "Abono Registrado", control: updatedControl });
    } else {
      res.status(404).send({ message: "Control Not Found" });
    }
  })
);

controlRouter.get(
  "/controlesporpaciente",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const idfiltro = mongoose.Types.ObjectId(req.id);
    const controles = await Control.find({ paciente: idfiltro })
      .populate("paciente", "nombre", "apellido")
      .sort({ createdAt: -1 });
    res.send({ controles, count });
  })
);

controlRouter.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const control = await Control.findById(req.params.id)
      .populate("paciente")
      .populate("doctor")
      .populate("serviciosItems.servicio");

    if (control) {
      res.send(control);
    } else {
      res.status(404).send({ message: "Control Not Found" });
    }
  })
);

controlRouter.get(
  "/controlesporpaciente/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const idfiltro = mongoose.Types.ObjectId(req.params.id);
    const controles = await Control.find({ paciente: { idfiltro } }).sort({
      createdAt: -1,
    });
    res.send({ controles });
  })
);

controlRouter.delete(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const control = await Control.findById(req.params.id);

    if (control) {
      const deleteControl = await control.deleteOne({ _id: req.params.id });
      res.send({ message: "Control Eliminado", control: deleteControl });
    } else {
      res.status(404).send({ message: "Control No Encontrado" });
    }
  })
);

export default controlRouter;
