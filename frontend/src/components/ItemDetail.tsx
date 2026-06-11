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
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <Link to="/">Back to list</Link>
      </div>
    );
  }

  if (!item) {
    return null;
  }

  return (
    <div>
      <h1>{item.name}</h1>
      <dl>
        <dt>Group</dt>
        <dd>{item.group}</dd>
        <dt>Created</dt>
        <dd>{new Date(item.created_at).toLocaleString()}</dd>
        <dt>Updated</dt>
        <dd>{new Date(item.updated_at).toLocaleString()}</dd>
      </dl>
      <nav>
        <Link to={`/items/${item.id}/edit`}>Edit</Link>
        {" | "}
        <Link to="/">Back to list</Link>
      </nav>
    </div>
  );
}
