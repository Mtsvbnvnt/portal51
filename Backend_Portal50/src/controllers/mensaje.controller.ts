import { Request, Response } from 'express';
import Mensaje from '../models/mensaje.model';
import mongoose from 'mongoose';

// Enviar mensaje
export const enviarMensaje = async (req: Request, res: Response) => {
  try {
    const nuevoMensaje = new Mensaje({
      remitenteId: req.body.remitenteId,
      destinatarioId: req.body.destinatarioId,
      relacionadoA: req.body.relacionadoA,
      relacionadoId: req.body.relacionadoId,
      mensaje: req.body.mensaje,
    });

    await nuevoMensaje.save();
    res.status(201).json({ message: 'Mensaje enviado con éxito', data: nuevoMensaje });
  } catch (error) {
    console.error('❌ Error al enviar mensaje:', error);
    res.status(500).json({ message: 'Error al enviar mensaje' });
  }
};

// Obtener conversación entre dos usuarios
export const obtenerConversacion = async (req: Request, res: Response) => {
  const { userA, userB } = req.params;

  try {
    const mensajes = await Mensaje.find({
      $or: [
        { remitenteId: userA, destinatarioId: userB },
        { remitenteId: userB, destinatarioId: userA }
      ]
    }).sort({ fecha: 1 }); // Orden cronológico

    res.status(200).json(mensajes);
  } catch (error) {
    console.error('❌ Error al obtener conversación:', error);
    res.status(500).json({ message: 'Error al obtener la conversación' });
  }
};
