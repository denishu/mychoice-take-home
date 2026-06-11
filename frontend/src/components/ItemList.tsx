import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getItems } from "../api/items";
import type { Item } from "../types/item";

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getItems()
      .then((data) => {
        setItems(data);
        setError(null);
      })
      .catch(() => {
        setError("Could not load items.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading items…</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (items.length === 0) {
    return (
      <div>
        <p>No items available.</p>
        <Link to="/items/new">Create Item</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Items</h1>
      <Link to="/items/new">Create Item</Link>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <Link to={`/items/${item.id}`}>
              {item.name} — {item.group}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
