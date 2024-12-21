import React from 'react';
import Select from 'react-select';
import { XeroAccount, ActualCategory } from '../types';

interface Props {
  xeroAccount: XeroAccount;
  actualCategories: ActualCategory[];
  onMappingChange: (xeroAccountId: string, actualCategoryId: string) => void;
}

export function CategoryMapper({ xeroAccount, actualCategories, onMappingChange }: Props) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-1/3">
        <p className="font-medium">{xeroAccount.name}</p>
        <p className="text-sm text-gray-500">{xeroAccount.type}</p>
      </div>
      <div className="w-2/3">
        <Select
          options={actualCategories.map(cat => ({
            value: cat.id,
            label: `${cat.name} (${cat.type})`
          }))}
          onChange={option => onMappingChange(xeroAccount.id, option?.value)}
          placeholder="Select Actual category..."
          isClearable
        />
      </div>
    </div>
  );
}