// src/db/index.js
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '../../data/mappings.db');

// Initialize database
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Load and execute schema
const schema = fs.readFileSync(join(__dirname, 'schema.sql'), 'utf8');
db.exec(schema);

// Prepared statements
const statements = {
  getAllXeroAccounts: db.prepare('SELECT * FROM xero_accounts'),
  insertXeroAccount: db.prepare(`
    INSERT INTO xero_accounts (xero_account_id, name, type, status, updated_datetime)
    VALUES (@xero_account_id, @name, @type, @status, @updated_datetime)
    ON CONFLICT(xero_account_id) DO UPDATE SET
      name = @name,
      type = @type,
      status = @status,
      updated_datetime = @updated_datetime
  `),

  getAllActualCategories: db.prepare('SELECT * FROM actual_categories'),
  insertActualCategory: db.prepare(`
    INSERT INTO actual_categories (id, name, group_name)
    VALUES (@id, @name, @group_name)
    ON CONFLICT(id) DO UPDATE SET
      name = @name,
      group_name = @group_name
  `),

  getAllMappings: db.prepare('SELECT * FROM xero_to_actual_category_mapping'),
  insertMapping: db.prepare(`
    INSERT INTO xero_to_actual_category_mapping (xero_account_id, actual_category_id)
    VALUES (@xero_account_id, @actual_category_id)
    ON CONFLICT(xero_account_id, actual_category_id) DO NOTHING
  `),
  deleteMapping: db.prepare('DELETE FROM xero_to_actual_category_mapping WHERE xero_account_id = ? AND actual_category_id = ?')
};

// Database functions
export function getAllXeroAccounts() {
  return statements.getAllXeroAccounts.all();
}

export function saveXeroAccount(account) {
  console.log('Attempting to save Xero account:', account);
  return statements.insertXeroAccount.run({
    xero_account_id: account.accountID,
    name: account.name,
    type: account.type,
    status: account.status,
    updated_datetime: account.updatedDateUTC
      ? new Date(account.updatedDateUTC).toISOString()
      : '1970-01-01T00:00:00.000Z',
  });
}

export function getAllActualCategories() {
  return statements.getAllActualCategories.all();
}

export function saveActualCategory(category) {
  return statements.insertActualCategory.run(category);
}

export function getAllMappings() {
  return statements.getAllMappings.all();
}

export function saveMapping(mapping) {
  return statements.insertMapping.run(mapping);
}

export function deleteMapping(xeroAccountId, actualCategoryId) {
  return statements.deleteMapping.run(xeroAccountId, actualCategoryId);
}

// Ensure clean shutdown
process.on('exit', () => db.close());
