import express from "express";
import expressAsyncHandler from "express-async-handler";
import Gasto from "../models/gasto.js";
import { isAdmin, isAuth } from "../utils.js";

const gastoRouter = express.Router();

gastoRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const gastos = await Gasto.find({}).sort({ createdAt: -1 });

    res.send({
      gastos,
    });
  })
);


gastoRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const gasto = await Gasto.findById(req.params.id);

    if (gasto) {
      res.send(gasto);
    } else {
      res.status(404).send({ message: "Gasto No encontrado" });
    }
  })
);

gastoRouter.post(
  "/create",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    console.log("gastos router inside")
    const gasto = new Gasto({
      fecha: req.body.fecha,
      referencia: req.body.referencia,
      formadepago: req.body.formadepago,
      banco: req.body.banco,
      categoria: req.body.categoria,
      beneficiario: req.body.beneficiario,
      descripcion: req.body.descripcion,
      montousd: req.body.montousd,
      montobs: req.body.montobs,
      cambiodia: req.body.cambiodia,
      registradopor: req.body.registradopor,
      imageurl: req.body.imageurl,
      imageurl2: req.body.imageurl2,
      searchstring: req.body.referencia.concat(
        " ",
        req.body.descripcion,
        " ",
        req.body.formadepago,
        " ",
        req.body.banco,
        " ",
        req.body.categoria,
        " ",
        req.body.beneficiario,
        " ",
        req.body.registradopor
      ),
    });
    const createdGasto = await gasto.save();

    res.send({
      _id: createdGasto._id,
      fecha: createdGasto.fecha,
      referencia: createdGasto.referencia,
      formadepago: createdGasto.formadepago,
      banco: createdGasto.banco,
      categoria: createdGasto.categoria,
      beneficiario: createdGasto.beneficiario,
      descripcion: createdGasto.descripcion,
      montousd: createdGasto.existencia,
      montobs: createdGasto.reposicion,
      cambiodia: createdGasto.costousd,
      registradopor: createdGasto.registradopor,
      imageurl: createdGasto.imageurl,
      imageurl2: createdGasto.imageurl2,
    });
  })
);

gastoRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const gasto = await Gasto.findById(productId);

    if (gasto) {
      gasto.fecha = req.body.fecha;
      gasto.referencia = req.body.referencia;
      gasto.formadepago = req.body.formadepago;
      gasto.banco = req.body.banco;
      gasto.categoria = req.body.categoria;
      gasto.beneficiario = req.body.beneficiario;
      gasto.descripcion = req.body.descripcion;
      gasto.montousd = req.body.montousd;
      gasto.montobs = req.body.montobs;
      gasto.cambiodia = req.body.cambiodia;
      gasto.registradopor = req.body.registradopor;
      gasto.imageurl = req.body.imageurl;
      gasto.imageurl2 = req.body.imageurl2;
      gasto.searchstring = req.body.referencia.concat(
        " ",
        req.body.descripcion,
        " ",
        req.body.formadepago,
        " ",
        req.body.banco,
        " ",
        req.body.categoria,
        " ",
        req.body.beneficiario,
        " ",
        req.body.registradopor
      );

      const updatedGasto = await gasto.save();
      res.send({ message: "Gasto Actualizado", gasto: updatedGasto });
    } else {
      res.status(404).send({ message: "Gasto no Encontrado" });
    }
  })
);

gastoRouter.delete(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const gasto = await Gasto.findById(req.params.id);
    if (gasto) {
      const deleteGasto = await gasto.deleteOne();
      res.send({ message: "Gasto Eliminado", gasto: deleteGasto });
    } else {
      res.status(404).send({ message: "Gasto No Encontrado" });
    }
  })
);

export default gastoRouter;
