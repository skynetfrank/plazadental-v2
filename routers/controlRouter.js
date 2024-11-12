import express from "express";
import expressAsyncHandler from "express-async-handler";
import Control from "../models/control.js";
import { isAdmin, isAuth } from "../utils.js";

import mongoose from "mongoose";

const controlRouter = express.Router();

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
      montoUsd: req.body.montoUsd,
      montoBs: req.body.montoBs,
      tasaIva: req.body.tasaIva,
      montoIva: req.body.montoIva,
      totalGeneralBs: req.body.totalGeneralBs,
      tasaComisionDr: req.body.tasaComisionDr,
      tasaComisionPlaza: req.body.tasaComisionPlaza,
      montoComisionDr: req.body.montoComisionDr,
      montoComisionPlaza: req.body.montoComisionPlaza,
      pagoInfo: req.body.pagoInfo,
      factura: req.body.factura,
      facturaControl: req.body.facturacontrol,
      fechaFactura: req.body.fechaFactura,
    });

    const createdcontrol = await control.save();

    res.send({
      _id: createdcontrol._id,
      paciente: createdcontrol.pacienteId,
      doctor: createdcontrol.doctorId,
      user: createdcontrol.user,
      fechaControl: createdcontrol.fechaControl,
      esCita1: createdcontrol.esCita1,
      evaluacion: createdcontrol.evaluacion,
      tratamiento: createdcontrol.tratamiento,
      recipe: createdcontrol.recipe,
      indicaciones: createdcontrol.indicaciones,
      serviciosItems: createdcontrol.serviciosItems,
      materiales: createdcontrol.materiales,
      cambioBcv: createdcontrol.cambioBcv,
      montoUsd: createdcontrol.montoUsd,
      montoBs: createdcontrol.montoBs,
      tasaIva: createdcontrol.tasaIva,
      montoIva: createdcontrol.montoIva,
      totalGeneralBs: createdcontrol.totalGeneralBs,
      tasaComisionDr: createdcontrol.tasaComisionDr,
      tasaComisionPlaza: createdcontrol.montoComisionPlaza,
      montoComisionDr: createdcontrol.montoComisionDr,
      montoComisionPlaza: createdcontrol.montoComisionPlaza,
      pagoInfo: createdcontrol.pagoInfo,
      factura: createdcontrol.factura,
      facturaControl: createdcontrol.facturacontrol,
      fechaFactura: createdcontrol.fechaFactura,
    });
  })
);

controlRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const controlId = req.params.id;
    const control = await Control.findById(controlId);
    if (control) {
      control.doctor = req.body.doctorId;
      control.user = req.body.user;
      control.fechaControl = req.body.fechaControl;
      control.esCita1 = req.body.esCita1;
      control.evaluacion = req.body.evaluacion;
      control.tratamiento = req.body.tratamiento;
      control.recipe = req.body.recipe;
      control.indicaciones = req.body.indicaciones;
      control.serviciosItems = req.body.serviciosItems;
      control.materiales = req.body.materiales;
      control.cambioBcv = req.body.cambioBcv;
      control.montoUsd = req.body.montoUsd;
      control.montoBs = req.body.montoBs;
      control.tasaIva = req.body.tasaIva;
      control.montoIva = req.body.montoIva;
      control.totalGeneralBs = req.body.totalGeneral;
      control.tasaComisionDr = req.body.tasaComisionDr;
      control.tasaComisionPlaza = req.body.tasaComisionPlaza;
      control.montoComisionDr = req.body.montoComisionDr;
      control.montoComisionPlaza = req.body.montoComisionPlaza;
      control.pagoInfo = req.body.pagoInfo;

      const updatedControl = await control.save();
      res.send({ message: "Control Actualizado", control: updatedControl });
    } else {
      res.status(404).send({ message: "Control no Encontrado" });
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
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const control = await Control.findById(req.params.id);

    if (control) {
      const deleteControl = await control.remove();
      res.send({ message: "Control Eliminado", control: deleteControl });
    } else {
      res.status(404).send({ message: "Control No Encontrado" });
    }
  })
);

export default controlRouter;
