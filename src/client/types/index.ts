export interface XeroAccount {
  id: string;
  name: string;
  type: string;
  status: string;
}

export interface ActualCategory {
  id: string;
  name: string;
  type: string;
  group?: string;
}

export interface CategoryMapping {
  xeroAccountId: string;
  actualCategoryId: string;
}