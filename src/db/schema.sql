CREATE TABLE IF NOT EXISTS xero_accounts (
    xero_account_id TEXT NOT NULL PRIMARY KEY,               -- Unique identifier for the account
    name TEXT NOT NULL,                         -- Name of the account
    type TEXT NOT NULL,                         -- Type of account (e.g., REVENUE, EXPENSE)
    status TEXT NOT NULL,                       -- Account status (e.g., ACTIVE)
    updated_datetime DATETIME NOT NULL          -- Timestamp of the last update to the account
);

CREATE TABLE IF NOT EXISTS actual_categories (
    id TEXT NOT NULL PRIMARY KEY,               -- Unique identifier for the category
    name TEXT NOT NULL,                         -- Name of the category
    group_name TEXT                             -- Name of the group the category belongs to (optional)
);


CREATE TABLE IF NOT EXISTS xero_to_actual_category_mapping (
    xero_account_id TEXT NOT NULL,              -- Foreign key to xero_accounts.xero_account_id
    actual_category_id TEXT NOT NULL,           -- Foreign key to actual_categories.id
    PRIMARY KEY (xero_account_id, actual_category_id), -- Ensures unique mappings
    FOREIGN KEY (xero_account_id) REFERENCES xero_accounts(xero_account_id),
    FOREIGN KEY (actual_category_id) REFERENCES actual_categories(id)
);


CREATE TRIGGER IF NOT EXISTS update_timestamp
AFTER UPDATE ON xero_to_actual_category_mapping
FOR EACH ROW
BEGIN
    UPDATE xero_to_actual_category_mapping
    SET updated_at = CURRENT_TIMESTAMP
    WHERE xero_account_id = NEW.xero_account_id;
END;
