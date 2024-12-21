import { XeroAccount, ActualCategory, CategoryMapping } from '../types';

export async function fetchXeroAccounts(): Promise<XeroAccount[]> {
  const response = await fetch('/api/xero/accounts');
  if (!response.ok) {
    throw new Error('Failed to fetch Xero accounts');
  }
  return response.json();
}

export async function fetchActualCategories(): Promise<ActualCategory[]> {
  const response = await fetch('/api/actual/categories');
  if (!response.ok) {
    throw new Error('Failed to fetch Actual categories');
  }
  return response.json();
}

export async function saveMappings(mappings: CategoryMapping[]): Promise<void> {
  const response = await fetch('/api/mappings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mappings })
  });
  if (!response.ok) {
    throw new Error('Failed to save mappings');
  }
  return response.json();
}