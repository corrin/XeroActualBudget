import { saveMapping, getAllMappings } from '../db/index.js';

export async function saveMappings(req, res) {
  try {
    const { mappings } = req.body;
    console.log('Saving mappings:', mappings);

    for (const mapping of mappings) {
      await saveMapping({
        xero_account_id: mapping.xeroAccountId,
        actual_category_id: mapping.actualCategoryId
      });
    }

    const allMappings = await getAllMappings();
    console.log('Current mappings after save:', allMappings);

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving mappings:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getMappings(req, res) {
  try {
    const mappings = await getAllMappings();
    res.json(mappings);
  } catch (error) {
    console.error('Error fetching mappings:', error);
    res.status(500).json({ error: error.message });
  }
}
