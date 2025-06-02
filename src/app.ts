import express from 'express';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();
const app = express();

app.get('/api/prisma-test', async (req, res) => {
  try {
    // Consulta de prueba a la base de datos
    const result = await prisma.$queryRaw`SELECT 1+1 as sum`;
    
    res.json({
      success: true,
      message: 'Prisma está funcionando correctamente',
      databaseResponse: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al conectar con Prisma',

    });
  }
});

export { app, prisma };