import express from 'express';
import expressAsyncHandler from 'express-async-handler';
//import dataStock from '../models/dataStock.js';
import Producto from '../models/producto.js';
import { isAdmin, isAuth } from '../utils.js';

const productRouter = express.Router();

productRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const pageSize = 9;
    const page = Number(req.query.pageNumber) || 1;

    const nombre = req.query.nombre || '';
    const searcherFilter = nombre ? { searchstring: { $regex: nombre, $options: 'i' } } : {};

    const count = await Producto.countDocuments({
      ...searcherFilter,
    });

    const productos = await Producto.find({
      ...searcherFilter,
    })
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    res.send({ productos, page, pages: Math.ceil(count / pageSize), count });
  })
);

productRouter.get(
  '/all',
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

    const count = await Producto.countDocuments({});
    const productos = await Producto.aggregate([
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
          day: { $dayOfMonth: '$createdAt' },
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' },
          fecha: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
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
    res.send({ productos });
  })
);

productRouter.get(
  '/buscar',
  expressAsyncHandler(async (req, res) => {
    const codigo = req.query.codigo || '';
    //const codigoFinder = codigo ? { codigo: { $regex: codigo, $options: 'i' } } : {};
    const codigoFinder = codigo ? { codigo } : {};
    const producto = await Producto.find({
      ...codigoFinder,
    });
    res.send({ producto });
  })
);

productRouter.get(
  '/encontrar',
  expressAsyncHandler(async (req, res) => {
    const codigo = req.query.codigo || '';
    const producto = await Producto.findOne({ codigo });
    if (producto) {
      res.send({
        productId: producto._id,
        codigo: codigo,
        nombre: producto.nombre,
        marca: producto.marca,
        descripcion: producto.descripcion,
        preciousd: producto.preciousd,
        preciobs: producto.preciobs,
        existencia: producto.existencia,
      });
    } else {
      res.status(404).send({ message: 'Producto No encontrado' });
    }
  })
);

productRouter.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
    //await Producto.deleteMany({});
    // const insertedProducts = await Producto.insertMany(dataStock.productos);
    // res.send(insertedProducts);
  })
);

productRouter.get(
  '/onlycodes',
  expressAsyncHandler(async (req, res) => {
    const codigos = await Producto.find({}).select({ _id: 0, codigo: 1 }).sort({ codigo: 1 });
    res.send({ codigos });
  })
);

productRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const producto = await Producto.findById(req.params.id);
    if (producto) {
      res.send(producto);
    } else {
      res.status(404).send({ message: 'Producto No encontrado' });
    }
  })
);

productRouter.post(
  '/create',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const producto = new Producto({
      codigo: req.body.codigo,
      nombre: req.body.nombre,
      marca: req.body.marca,
      presentacion: req.body.presentacion,
      unidades: req.body.unidades,
      descripcion: req.body.descripcion,
      existencia: req.body.existencia,
      reposicion: req.body.reposicion,
      costobs: req.body.costobs,
      costousd: req.body.costousd,
      preciobs: req.body.preciobs,
      preciousd: req.body.preciousd,
      proveedor: req.body.proveedor,
      imageurl: req.body.imageurl,
    });
    const createdProduct = await producto.save();
    res.send({
      _id: createdProduct._id,
      codigo: createdProduct.codigo,
      nombre: createdProduct.nombre,
      marca: createdProduct.marca,
      presentacion: createdProduct.presentacion,
      unidades: createdProduct.unidades,
      categoria: createdProduct.categoria,
      descripcion: createdProduct.descripcion,
      existencia: createdProduct.existencia,
      reposicion: createdProduct.reposicion,
      costobs: createdProduct.costobs,
      costousd: createdProduct.costousd,
      preciobs: createdProduct.preciobs,
      preciousd: createdProduct.preciousd,
      proveedor: createdProduct.proveedor,
      imageurl: createdProduct.imageurl,
    });
  })
);

productRouter.post(
  '/fillselector',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const selector = new Selector({
      etiqueta: req.body.etiqueta,
    });
    const createdSelector = await selector.save();
    res.send({
      _id: createdSelector._id,
      etiqueta: createdSelector.etiqueta,
    });
  })
);

productRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const producto = await Producto.findById(productId);
    if (producto) {
      producto.codigo = req.body.codigo;
      producto.nombre = req.body.nombre;
      producto.marca = req.body.marca;
      producto.presentacion = req.body.presentacion;
      producto.unidades = req.body.unidades;
      producto.descripcion = req.body.descripcion;
      producto.existencia = req.body.existencia;
      producto.costobs = req.body.costobs;
      producto.costousd = req.body.costousd;
      producto.preciobs = req.body.preciobs;
      producto.preciousd = req.body.preciousd;
      producto.proveedor = req.body.proveedor;
      producto.imageurl = req.body.imageurl;

      const updatedProduct = await producto.save();
      res.send({ message: 'Producto Actualizado', producto: updatedProduct });
    } else {
      res.status(404).send({ message: 'Producto no Encontrado' });
    }
  })
);

productRouter.put(
  '/searcher/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const producto = await Producto.findById(productId);

    if (producto) {
      producto.reposicion = Number(7);
      const updatedProduct = await producto.save();
      res.send({ message: 'Producto Actualizado', producto: updatedProduct });
    } else {
      res.status(404).send({ message: 'Producto no Encontrado' });
    }
  })
);

productRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const producto = await Producto.findById(req.params.id);
    if (producto) {
      const deleteProduct = await producto.remove();
      res.send({ message: 'Producto Eliminado', product: deleteProduct });
    } else {
      res.status(404).send({ message: 'Producto No Encontrado' });
    }
  })
);

productRouter.put(
  '/existencia/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const producto = await Producto.findById(productId);

    if (producto) {
      if (req.body.movimiento === 'salida') {
        const salida = Number(producto.existencia) - Number(req.body.cantidad);
        producto.existencia = salida;
      }
      if (req.body.movimiento === 'compras') {
        const entrada = Number(producto.existencia) + Number(req.body.cantidad);
        producto.existencia = entrada;
      }
      if (req.body.movimiento === 'ajuste-salida') {
        const ajustesalida = Number(producto.existencia) - Number(req.body.cantidad);
        producto.existencia = ajustesalida;
      }
      if (req.body.movimiento === 'ajuste-entrada') {
        const ajusteentrada = Number(producto.existencia) + Number(req.body.cantidad);
        producto.existencia = ajusteentrada;
      }

      const updatedProduct = await producto.save();

      res.send({ message: 'Existencia Actualizada', product: updatedProduct });
    } else {
      res.status(404).send({ message: 'Producto No Encontrado' });
    }
  })
);

export default productRouter;
