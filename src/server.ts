import { app } from "./app";
import { env } from "./config/env";

console.log("⏳ Iniciando servidor...");

app.listen(env.PORT, env.HOST, () => {
  console.log(`🚀 Servidor corriendo en http://${env.HOST}:${env.PORT}`);
});
