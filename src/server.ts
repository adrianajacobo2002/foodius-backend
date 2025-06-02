
import { app, prisma } from './app';

const PORT = 3000;

// Función de prueba de conexión
async function testPrismaConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Conexión a Prisma exitosa');
    
    // Consulta de prueba adicional
    const testQuery = await prisma.$queryRaw`SELECT 1+1 as result`;
    console.log('🔢 Resultado de prueba de consulta:', testQuery);
  } catch (error) {
    console.error('❌ Error de conexión con Prisma:', error);
    process.exit(1);
  }
}

// Iniciar servidor después de verificar Prisma
testPrismaConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor funcionando en http://localhost:${PORT}`);
    console.log(`🔍 Prueba Prisma en: http://localhost:${PORT}/api/prisma-test`);
  });
});

// Manejar cierre limpio
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('🔌 Conexión a Prisma cerrada');
  process.exit(0);
});