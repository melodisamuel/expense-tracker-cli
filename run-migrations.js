// run-migrations.js
import { Sequelize } from 'sequelize';
import { readdirSync } from 'fs';
import path from 'path';
import  sequelize  from './models/index.js'; // Or import your sequelize instance if necessary

async function runMigrations() {
  const migrationsFolder = path.join(__dirname, 'migrations');
  const migrationFiles = readdirSync(migrationsFolder).filter(file => file.endsWith('.js'));

  for (const file of migrationFiles) {
    const migration = await import(path.join(migrationsFolder, file));
    await migration.up(sequelize.getQueryInterface(), Sequelize);
    console.log(`${file} migration completed.`);
  }

  console.log('All migrations have been run successfully.');
}

runMigrations().catch(err => {
  console.error('Error running migrations:', err);
});
