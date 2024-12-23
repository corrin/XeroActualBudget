# TODOs

## Priority 1 (Current)
- DONE: Fix mapping persistence bug
- DONE: Track down missing xeroAccountId

## Priority 2
- Add multi-business support
  - Store Xero tenantId with mappings
  - Add tenant selection UI
  - Filter mappings by tenant
  - Store AB budget ID with mappings
- Show Actual Budget category groups in dropdown
- Replace manual save with autosave
- Fix build/cache system to prevent stale code
- Cache data from Xero so we don't sync all accounts every run

## Low Priority
- Split the accounts map in two.  Needs mapping and already mapped
- Investigate ngrok websocket timeout error
- Add "Do Not Map" category for system accounts
- Add visual indicators for system accounts (Bank, AP, AR)
