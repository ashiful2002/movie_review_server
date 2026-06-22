import app from "./app";
import { envVars } from "./app/config/env";

async function main() {
  try {
    app.listen(envVars.PORT, () => {
      console.log(`Server running on http://localhost:${envVars.PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
}

main();
