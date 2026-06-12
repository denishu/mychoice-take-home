import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getItem } from "../api/items";
import type { Item } from "../types/item";
import axios from "axios";

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function fetchItem() {
      setLoading(true);
      setError(null);
      try {
        const data = await getItem(Number(id));
        if (!cancelled) {
          setItem(data);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          if (axios.isAxiosError(err) && err.response?.status === 404) {
            setError("Item not found");
          } else {
            setError("Could not load item details");
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchItem();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <div className="page"><p className="loading">Loading...</p></div>;
  }

  if (error) {
    return (
      <div className="page">
        <p className="form-api-error">{error}</p>
        <Link to="/" className="link">← Back to list</Link>
      </div>
    );
  }

  if (!item) {
    return null;
  }

  return (
    <div className="page item-detail">
      <h1>{item.name}</h1>
      <span className="item-badge">{item.group}</span>
      <div className="item-meta">
        <dl>
          <dt>Created</dt>
          <dd>{new Date(item.created_at).toLocaleString()}</dd>
          <dt>Updated</dt>
          <dd>{new Date(item.updated_at).toLocaleString()}</dd>
        </dl>
      </div>
      <nav className="item-detail-nav">
        <Link to={`/items/${item.id}/edit`} className="btn btn-primary">Edit</Link>
        <Link to="/" className="btn btn-secondary">← Back to list</Link>
      </nav>
    </div>
  );
}
