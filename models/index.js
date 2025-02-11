import { Sequelize } from 'sequelize';
import { sequelize } from ''; // Import your sequelize instance here
import path from 'path';
import fs from 'fs';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename); // Define __dirname for ES modules

async function runMigrations() {
  try {
    console.log("Running migrations...");

    // Assuming migrations are in a 'migrations' directory
    const migrationsPath = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsPath).filter(file => file.endsWith('.js'));

    for (const file of files) {
      const migration = await import(path.join(migrationsPath, file));
      if (typeof migration.up === 'function') {
        await migration.up(sequelize.getQueryInterface(), Sequelize);
        console.log(`Migration ${file} completed.`);
      }
    }

    console.log('Migrations finished successfully.');
  } catch (error) {
    console.error('Error running migrations:', error);
  }
}

runMigrations();
