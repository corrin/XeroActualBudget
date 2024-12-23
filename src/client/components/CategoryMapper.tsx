import React from 'react';
import Select from 'react-select';
import {XeroAccount, ActualCategory} from '../types';
import {saveMappings} from "../services/api.ts";
interface Props {
    xeroAccount: XeroAccount;
    actualCategories: ActualCategory[];
    onMappingChange: (xeroAccountId: string, actualCategoryId: string) => void;
    selectedCategoryId: string | null; // Add this prop
}

export function CategoryMapper({ xeroAccount, actualCategories, onMappingChange, selectedCategoryId }: Props) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-1/3">
                <p className="font-medium">{xeroAccount.name}</p>
                <p className="text-sm text-gray-500">{xeroAccount.type}</p>
            </div>
            <div className="w-2/3">
                <Select
                    options={actualCategories.map((cat) => ({
                        value: cat.id,
                        label: cat.group ? `${cat.group} > ${cat.name}` : cat.name,
                    }))}
                    value={selectedCategoryId ? { value: selectedCategoryId, label: actualCategories.find((cat) => cat.id === selectedCategoryId)?.name } : null}
                    onChange={(option) => {
                        console.log(
                            `Mapped Xero account '${xeroAccount.name}' (ID: ${xeroAccount.accountID}) to Actual category '${option?.label || 'None'}' (ID: ${option?.value || 'None'})`
                        );
                        onMappingChange(xeroAccount.accountID, option?.value || 'None');
                        saveMappings([{ xeroAccountId: xeroAccount.accountID, actualCategoryId: option?.value || '' }]);
                    }}
                    placeholder="Select Actual category..."
                    isClearable
                />
            </div>
        </div>
    );
}
