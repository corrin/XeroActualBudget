import { XeroAccount, ActualCategory, CategoryMapping } from '../types';

export async function fetchXeroAccounts(): Promise<XeroAccount[]> {
  console.log('Making request to /api/xero/accounts');
  const response = await fetch('/api/xero/accounts');
  console.log('Response status:', response.status);

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error response:', errorData);
    throw new Error(errorData.error + (errorData.details ? ': ' + errorData.details : ''));
  }

  const data = await response.json();
  return data;
}

export async function fetchActualCategories(): Promise<ActualCategory[]> {
  console.log('Making request to /api/actual/categories');
  const response = await fetch('/api/actual/categories');
  console.log('Response status:', response.status);

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error response:', errorData);
    throw new Error(errorData.error + (errorData.details ? ': ' + errorData.details : ''));
  }

  const data = await response.json();
  console.log('Successfully fetched Actual categories:', data);
  return data;
}

export async function saveMappings(mappings: CategoryMapping[]): Promise<void> {
  console.log('Saving mappings:', mappings);
  const response = await fetch('/api/mappings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mappings })
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error saving mappings:', errorData);
    throw new Error(errorData.error + (errorData.details ? ': ' + errorData.details : ''));
  }

  console.log('Successfully saved mappings');
}