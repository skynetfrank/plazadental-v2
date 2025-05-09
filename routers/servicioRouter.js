import express from "express";
import expressAsyncHandler from "express-async-handler";
import Servicio from "../models/servicio.js";
import { isAdmin, isAuth } from "../utils.js";

const servicioRouter = express.Router();

servicioRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const servicios = await Servicio.find({});
    res.send({ servicios });
  })
);

servicioRouter.get(
  "/allservices",
  expressAsyncHandler(async (req, res) => {
    const servicios = await Servicio.find({});
    res.send({ servicios });
  })
);

servicioRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const servicio = await Servicio.findById(req.params.id);
    if (servicio) {
      res.send(servicio);
    } else {
      res.status(404).send({ message: "Servicio No encontrado" });
    }
  })
);

servicioRouter.post(
  "/create",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    console.log("req.body", req.body)
    const servicio = new Servicio({
      codigo: req.body.servicio.codigo,
      nombre: req.body.servicio.nombre,
      area: req.body.servicio.area,
      descripcion: req.body.servicio.descripcion,
      preciobs: req.body.servicio.preciobs,
      preciousd: req.body.servicio.preciousd,
      cambio: req.body.servicio.cambio,
      searchstring: req.body.servicio.codigo.concat(
        " ",
        req.body.servicio.nombre,
        " ",
        req.body.servicio.area,
      ),
    });
    const createdService = await servicio.save();
    res.send({
      _id: createdService._id,
      codigo: createdService.codigo,
      nombre: createdService.nombre,
      area: createdService.area,
      descripcion: createdService.descripcion,
      preciobs: createdService.preciobs,
      preciousd: createdService.preciousd,
      cambio: createdService.cambio,
    });
  })
);

servicioRouter.put(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const servicioId = req.params.id;
    const servicio = await Servicio.findById(servicioId);
    if (servicio) {
      servicio.codigo = req.body.codigo;
      servicio.nombre = req.body.nombre;
      servicio.area = req.body.area;
      servicio.descripcion = req.body.descripcion;
      servicio.preciobs = req.body.preciobs;
      servicio.preciousd = req.body.preciousd;
      const updatedService = await servicio.save();
      res.send({ message: "Servicio Actualizado", servicio: updatedService });
    } else {
      res.status(404).send({ message: "Servicio no Encontrado" });
    }
  })
);

servicioRouter.put(
  "/searcher/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const servicioId = req.params.id;
    const servicio = await Servicio.findById(servicioId);

    if (servicio) {
      servicio.reposicion = Number(7);
      const updatedService = await servicio.save();
      res.send({ message: "Servicio Actualizado", servicio: updatedService });
    } else {
      res.status(404).send({ message: "Servicio no Encontrado" });
    }
  })
);

servicioRouter.delete(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const servicio = await Servicio.findById(req.params.id);
    if (servicio) {
      const deleteService = await servicio.remove();
      res.send({ message: "Servicio Eliminado", servicio: deleteService });
    } else {
      res.status(404).send({ message: "Servicio No Encontrado" });
    }
  })
);

export default servicioRouter;
