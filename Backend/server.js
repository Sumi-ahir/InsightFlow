import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import http from "http";
import { initSocket } from "./src/sockets/server.socket.js";
const PORT = process.env.PORT || 5000;
import './src/config/passport.config.js'

const httpServer = http.createServer(app);
initSocket(httpServer);

connectDB().catch((err) => {
  console.error("mon/goDB connected failed", err);
  process.exit(1);
});

httpServer.listen(PORT, () => {
  console.log(`server is connected on port ${PORT}`);
});
