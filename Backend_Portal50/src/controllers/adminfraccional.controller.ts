import { Request, Response } from 'express';
import admin from '../config/firebase';
import { User } from '../models/user.model';
import { Empresa } from '../models/empresa.model';
import nodemailer from 'nodemailer';

function generarPassword(length = 10) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let pass = '';
  for (let i = 0; i < length; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

export const crearAdminFraccional = async (req: Request, res: Response) => {
  try {
    const { nombre, email, telefono, rol } = req.body;
    if (!nombre || !email) return res.status(400).json({ message: 'Faltan datos obligatorios' });

    // 1. Generar contraseña aleatoria
    const password = generarPassword();

    // 2. Crear usuario en Firebase
    const firebaseUser = await admin.auth().createUser({
      email,
      password,
      displayName: nombre,
      emailVerified: false,
      disabled: false
    });

    // 3. Crear usuario en MongoDB
    const nuevoUsuario = new User({
      uid: firebaseUser.uid,
      nombre,
      email,
      telefono,
      rol: rol === 'ejecutivo' ? 'ejecutivo' : 'admin-fraccional',
      activo: true
    });
    await nuevoUsuario.save();

    // 4. Enviar correo con credenciales
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: rol === 'ejecutivo' ? 'Acceso Ejecutivo Fraccional Portal50+' : 'Acceso Administrador Fraccional Portal50+',
      html: `<h2>Bienvenido a Portal50+</h2>
      <p>Has sido registrado como <b>${rol === 'ejecutivo' ? 'Ejecutivo Fraccional' : 'Administrador Fraccional'}</b>.</p>
      <p><b>Email:</b> ${email}<br/><b>Contraseña:</b> ${password}</p>
      <p>Accede en: <a href="https://portal50.com/admin-fraccional">portal50.com/admin-fraccional</a></p>`
    });

    res.status(201).json({ message: `${rol === 'ejecutivo' ? 'Ejecutivo' : 'Administrador fraccional'} creado y notificado`, uid: firebaseUser.uid });
  } catch (err: any) {
    if (err.code === 'auth/email-already-exists') {
      return res.status(409).json({ message: 'El email ya está registrado en Firebase' });
    }
    console.error('❌ Error creando admin fraccional:', err);
    res.status(500).json({ message: 'Error creando admin fraccional', error: err.message });
  }
};
