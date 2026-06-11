import axios from "axios";
import type { Item, ItemCreate, ItemUpdate } from "../types/item";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export async function getItems(): Promise<Item[]> {
  const response = await apiClient.get<Item[]>("/items/");
  return response.data;
}

export async function getItem(id: number): Promise<Item> {
  const response = await apiClient.get<Item>(`/items/${id}/`);
  return response.data;
}

export async function createItem(data: ItemCreate): Promise<Item> {
  const response = await apiClient.post<Item>("/items/", data);
  return response.data;
}

export async function updateItem(id: number, data: ItemUpdate): Promise<Item> {
  const response = await apiClient.patch<Item>(`/items/${id}/`, data);
  return response.data;
}
