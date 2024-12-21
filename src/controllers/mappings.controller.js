import { syncCategories } from '../services/actual.service.js';

export async function saveMappings(req, res) {
  try {
    const { mappings } = req.body;
    await syncCategories(mappings);
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving mappings:', error);
    res.status(500).json({ error: error.message });
  }
}