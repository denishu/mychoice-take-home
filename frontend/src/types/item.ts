export type ItemGroup = "Primary" | "Secondary";

export interface Item {
  id: number;
  name: string;
  group: ItemGroup;
  created_at: string;
  updated_at: string;
  author: string;
}

export interface ItemCreate {
  name: string;
  group: ItemGroup;
  author: string;
}

export interface ItemUpdate {
  name?: string;
  group?: ItemGroup;
  author?: string;
}
