import { saveMapping, getAllMappings, getMapping } from '../db/index.js';

export async function saveMappings(req, res) {
  try {
    const { mappings } = req.body;

    for (const mapping of mappings) {
      await saveMapping(mapping.xeroAccountId, mapping.actualCategoryId);
    }

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