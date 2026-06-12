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
    return <div className="page"><p className="loading">Loading items…</p></div>;
  }

  if (error) {
    return <div className="page"><p role="alert" className="form-api-error">{error}</p></div>;
  }

  if (items.length === 0) {
    return (
      <div className="page empty-state">
        <p>No items available.</p>
        <Link to="/items/new" className="btn btn-primary">Create Item</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="item-list-header">
        <h1>Items</h1>
        <Link to="/items/new" className="btn btn-primary">+ Create Item</Link>
      </div>
      <ul className="item-grid">
        {items.map((item) => (
          <li key={item.id} className="item-card">
            <Link to={`/items/${item.id}`}>
              {item.name}
            </Link>
            <span className="item-badge">{item.group}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
