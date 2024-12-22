import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '../../data/mappings.db');

// Ensure data directory exists
const dataDir = dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Load and execute schema
const schema = fs.readFileSync(join(__dirname, 'schema.sql'), 'utf8');
db.exec(schema);

// Prepared statements
const statements = {
  getMappings: db.prepare('SELECT * FROM category_mappings'),
  getMapping: db.prepare('SELECT * FROM category_mappings WHERE xero_account_id = ?'),
  insertMapping: db.prepare(`
    INSERT INTO category_mappings (xero_account_id, actual_category_id)
    VALUES (@xeroAccountId, @actualCategoryId)
    ON CONFLICT(xero_account_id) 
    DO UPDATE SET actual_category_id = @actualCategoryId, updated_at = CURRENT_TIMESTAMP
  `),
  deleteMapping: db.prepare('DELETE FROM category_mappings WHERE xero_account_id = ?')
};

export function getAllMappings() {
  return statements.getMappings.all();
}

export function getMapping(xeroAccountId) {
  return statements.getMapping.get(xeroAccountId);
}

export function saveMapping(xeroAccountId, actualCategoryId) {
  return statements.insertMapping.run({
    xeroAccountId,
    actualCategoryId
  });
}

export function saveMappings(mappings) {
  const insertMany = db.transaction((items) => {
    for (const { xeroAccountId, actualCategoryId } of items) {
      statements.insertMapping.run({ xeroAccountId, actualCategoryId });
    }
  });
  
  insertMany(mappings);
}

export function deleteMapping(xeroAccountId) {
  return statements.deleteMapping.run(xeroAccountId);
}

// Ensure clean shutdown
process.on('exit', () => db.close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));