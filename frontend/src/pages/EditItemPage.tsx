import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getItem } from "../api/items";
import ItemForm from "../components/ItemForm";
import type { Item } from "../types/item";

function EditItemPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No item ID provided");
      setLoading(false);
      return;
    }

    const fetchItem = async () => {
      try {
        const data = await getItem(Number(id));
        setItem(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load item");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) {
    return <p>Loading item...</p>;
  }

  if (error) {
    return <p role="alert">Error: {error}</p>;
  }

  if (!item) {
    return <p>Item not found.</p>;
  }

  return <ItemForm mode="edit" item={item} itemId={item.id} />;
}

export default EditItemPage;
