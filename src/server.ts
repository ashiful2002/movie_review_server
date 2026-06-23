import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedAdmin";
 
async function main() {
  try {
    await seedSuperAdmin();
    app.listen(envVars.PORT, () => {
      console.log(`Server running on http://localhost:${envVars.PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
}

main();
