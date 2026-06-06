import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Quote from '../models/quoteModel.js';
import { isAuth } from '../utils.js';

const quoteRouter = express.Router();

// GET all quotes
quoteRouter.get(
    '/',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const quotes = await Quote.find({})
            .populate('paciente', 'nombre apellido cedula')
            .populate('doctor', 'nombre apellido');
        res.send({ quotes });
    })
);

// GET quote by ID
quoteRouter.get(
    '/:id',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const quote = await Quote.findById(req.params.id)
            .populate('paciente', 'nombre apellido cedula')
            .populate('doctor', 'nombre apellido');
        if (quote) {
            res.send(quote);
        } else {
            res.status(404).send({ message: 'Cotización no encontrada' });
        }
    })
);

// POST create new quote
quoteRouter.post(
    '/',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const { paciente, items, discount, validity, cambioBcv } = req.body;

        // Recalcular subtotal y total en el backend para seguridad
        const subtotal = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
        const total = subtotal - (discount || 0);

        const quote = new Quote({
            paciente: paciente._id, // Asume que paciente es un objeto con _id
            doctor: req.user._id, // El usuario autenticado es el doctor
            items,
            subtotal,
            discount: discount || 0,
            total,
            validity: validity || 15,
            cambioBcv: cambioBcv || 0,
        });

        const createdQuote = await quote.save();
        res.status(201).send({ message: 'Cotización creada', quote: createdQuote });
    })
);

// PUT update quote
quoteRouter.put(
    '/:id',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const quote = await Quote.findById(req.params.id);
        if (quote) {
            const { items, discount, validity, cambioBcv } = req.body;

            // Recalcular para seguridad
            const subtotal = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
            const total = subtotal - (discount || 0);

            quote.items = items;
            quote.subtotal = subtotal;
            quote.discount = discount || 0;
            quote.total = total;
            quote.validity = validity || 15;
            quote.cambioBcv = cambioBcv !== undefined ? cambioBcv : quote.cambioBcv;

            const updatedQuote = await quote.save();
            res.send({ message: 'Cotización Actualizada', quote: updatedQuote });
        } else {
            res.status(404).send({ message: 'Cotización no encontrada' });
        }
    })
);

export default quoteRouter;