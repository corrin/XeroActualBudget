import { fetchJournals } from '../services/xero.service.js';
import { syncJournals } from '../services/actual.service.js';
import { getAllMappings } from '../db/index.js';

export async function syncXeroJournals(req, res, next) {
  try {
    const startDate = req.query.startDate; // Expecting start date as a query parameter
    if (!startDate) {
      return res.status(400).send({ error: 'Start date is required' });
    }

    const journals = await fetchJournals(startDate);
    const mappings = await getAllMappings(); // Fetch account mappings

    // Convert mappings to a format suitable for the syncJournals function
    const formattedMappings = mappings.reduce((acc, mapping) => {
      acc[mapping.xeroAccountId] = mapping.actualCategoryId;
      return acc;
    }, {});

    await syncJournals(journals, formattedMappings);

    res.send({ message: 'Xero journals synced successfully' });
  } catch (error) {
    next(error);
  }
}
