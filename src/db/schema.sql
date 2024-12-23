CREATE TABLE IF NOT EXISTS category_mappings (
  xero_account_id TEXT PRIMARY KEY,
  actual_category_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Trigger to update the updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_timestamp
AFTER UPDATE ON category_mappings
BEGIN
  UPDATE category_mappings
  SET updated_at = CURRENT_TIMESTAMP
  WHERE xero_account_id = NEW.xero_account_id;
END;