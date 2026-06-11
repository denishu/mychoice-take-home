export type ItemGroup = "Primary" | "Secondary";

export interface Item {
  id: number;
  name: string;
  group: ItemGroup;
  created_at: string;
  updated_at: string;
}

export interface ItemCreate {
  name: string;
  group: ItemGroup;
}

export interface ItemUpdate {
  name?: string;
  group?: ItemGroup;
}
