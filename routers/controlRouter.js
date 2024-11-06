import express from "express";
import expressAsyncHandler from "express-async-handler";
import Control from "../models/control.js";
import User from "../models/usuario.js";
import Producto from "../models/control.js";
import { isAdmin, isAuth } from "../utils.js";
import Paciente from "../models/paciente.js";
import mongoose from "mongoose";

const controlRouter = express.Router();

async function getPaciente(id) {
  const found = await Paciente.find({ idPaciente: id });
  return found;
}

controlRouter.get(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const pageSize = 9;
    const page = Number(req.query.pageNumber) || 1;
    const busqueda = req.query.busqueda || "";
    const multiFilter = busqueda ? { searchstring: { $regex: busqueda, $options: "i" } } : {};

    const count = await Control.countDocuments({
      ...multiFilter,
    });

    const controls = await Control.find({
      ...multiFilter,
    })
      .populate("paciente", "nombre", "apellido")
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .sort({ createdAt: -1 });
    res.send({ controls, page, pages: Math.ceil(count / pageSize) });
  })
);
controlRouter.get(
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

    const count = await Control.countDocuments({});
    const controls = await Control.aggregate([
      {
        $project: {
          _id: 1,
          controlItems: 1,
          vendedorInfo: 1,
          clienteInfo: 1,
          totalPrice: 1,
          taxPrice: 1,
          createdAt: 1,
          subtotal: 1,
          totalcomision: 1,
          comision: 1,
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
    res.send({ controls });
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

    const cotizaciones = await Cotizacion.aggregate([
      {
        $group: {
          _id: null,
          numCotizaciones: { $sum: 1 },
          totalCotizaciones: { $sum: "$subtotal" },
        },
      },
    ]);

    const articulosVendidos = await Control.aggregate([
      {
        $unwind: "$controlItems",
      },
      {
        $group: {
          _id: "$nombre",
          vendidos: { $sum: "$controlItems.qty" },
        },
      },
    ]);

    const totalProductos = await Producto.aggregate([
      {
        $group: {
          _id: null,
          numProductos: { $sum: 1 },
        },
      },
    ]);

    const totalStock = await Producto.aggregate([
      {
        $group: {
          _id: null,
          existenciaActual: { $sum: "$existencia" },
        },
      },
    ]);

    const valorTotalStock = await Producto.aggregate([
      {
        $group: {
          _id: null,
          valorInventario: { $sum: "$preciousd" },
        },
      },
    ]);

    const costoTotalStock = await Producto.aggregate([
      {
        $group: {
          _id: null,
          costoInventario: { $sum: "$costousd" },
        },
      },
    ]);

    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);

    const clientes = await Cliente.aggregate([
      {
        $group: {
          _id: null,
          numClientes: { $sum: 1 },
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
      users,
      controls,
      dailyControls,
      clientes,
      articulosVendidos,
      totalStock,
      valorTotalStock,
      costoTotalStock,
      cotizaciones,
      totalProductos,
    });
  })
);

controlRouter.get(
  "/mine",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    const busqueda = req.query.busqueda || "";
    const multiFilter = busqueda ? { searchstring: { $regex: busqueda, $options: "i" } } : {};
    const usuario = { user: req.user._id };

    const count = await Control.countDocuments({ ...usuario, ...multiFilter });

    const controls = await Control.find({ ...usuario, ...multiFilter })
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .sort({ createdAt: -1 });
    res.send({ controls, page, pages: Math.ceil(count / pageSize) });
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

    //const count = await Control.countDocuments({ ...joinid });
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
    //  console.log('req.params.id', req.params.id);
    const idfiltro = mongoose.Types.ObjectId(req.params.id);
    // console.log('idfiltro Object Type:', idfiltro);
    //const count = await Control.countDocuments({ ...joinid });

    const controles = await Control.find({ paciente: { idfiltro } }).sort({
      createdAt: -1,
    });
    res.send({ controles });
  })
);

controlRouter.put(
  "/:id/pay",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const control = await Control.findById(req.params.id).populate("user", "email name");
    if (control) {
      control.isPaid = true;
      control.paidAt = Date.now();
      control.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        email_address: req.body.email_address,
        banco: req.body.banco,
        referencia: req.body.referencia,
        fechaTransferencia: req.body.fechaTransferencia,
        refzelle: req.body.refzelle,
        cuentazelle: req.body.cuentazelle,
        refpagomobil: req.body.refpagomobil,
        refpagomixto: req.body.refpagomixto,
        refpagoefectivo: req.body.refpagoefectivo,
        montotransfer: req.body.montotransfer,
        montozelle: req.body.montozelle,
        montopagomobil: req.body.montopagomobil,
        monedas: req.body.monedas,
      };
      const updatedControl = await control.save();
      res.send({ message: "Pedido Pagado", control: updatedControl });
    } else {
      res.status(404).send({ message: "Pedido No Encontrado" });
    }
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
      res.send({ message: "Pedido Eliminado", control: deleteControl });
    } else {
      res.status(404).send({ message: "Pedido No Encontrado" });
    }
  })
);

controlRouter.put(
  "/:id/deliver",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const control = await Control.findById(req.params.id);
    if (control) {
      control.isDelivered = true;
      control.deliveredAt = Date.now();
      const updatedControl = await control.save();
      res.send({ message: "Pedido Entregado", control: updatedControl });
    } else {
      res.status(404).send({ message: "Pedido No Encontrado" });
    }
  })
);

controlRouter.put(
  "/:id/payconfirm",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const usuario = req.query.usuario;
    const control = await Control.findById(req.params.id);
    if (control) {
      control.paymentResult.status = "CONFIRMADO";
      control.paymentResult.confirmador = usuario;
      const updatedControl = await control.save();
      res.send({
        message: "Transferencia Bancaria Confirmada OK!",
        control: updatedControl,
      });
    } else {
      res.status(404).send({ message: "Orden No Encontrada" });
    }
  })
);

export default controlRouter;
