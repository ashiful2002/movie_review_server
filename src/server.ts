import http from "http";

import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedAdmin";
import { initializeSocket } from "./socket";
import { Server } from "socket.io";
import { redisService } from "./app/lib/radis";

// Create HTTP server
const server = http.createServer(app);
// Create Socket.IO server
export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://mm-db.vercel.app"],
    credentials: true,
  },
});

initializeSocket(io);

async function main() {
  try {
    // await seedSuperAdmin();

    await redisService.connect().catch(console.error);
    
    app.listen(envVars.PORT, () => {
      console.log(`Server running on http://localhost:${envVars.PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
}

main();
