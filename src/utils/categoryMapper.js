export function mapXeroToActualCategory(xeroAccount) {
  return {
    name: xeroAccount.name,
    type: getActualCategoryType(xeroAccount.type),
    group: getGroupName(xeroAccount.type)
  };
}

function getActualCategoryType(xeroType) {
  switch (xeroType) {
    case 'EXPENSE':
      return 'expense';
    case 'REVENUE':
      return 'income';
    default:
      return 'expense'; // Default to expense for other types
  }
}

function getGroupName(xeroType) {
  // Group categories based on Xero account type
  switch (xeroType) {
    case 'EXPENSE':
      return 'Expenses';
    case 'REVENUE':
      return 'Income';
    default:
      return 'Other';
  }
}