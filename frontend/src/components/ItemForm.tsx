import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createItem, updateItem } from "../api/items";
import type { Item, ItemGroup } from "../types/item";
import axios from "axios";

interface ItemFormCreateProps {
  mode: "create";
}

interface ItemFormEditProps {
  mode: "edit";
  item: Item;
  itemId: number;
}

type ItemFormProps = ItemFormCreateProps | ItemFormEditProps;

export default function ItemForm(props: ItemFormProps) {
  const navigate = useNavigate();

  const isEdit = props.mode === "edit";
  const initialName = isEdit ? props.item.name : "";
  const initialGroup: ItemGroup = isEdit ? props.item.group : "Primary";
  const initialAuthor = isEdit ? props.item.author : ""

  const [name, setName] = useState(initialName);
  const [group, setGroup] = useState<ItemGroup>(initialGroup);
  const [author, setAuthor] = useState(initialAuthor);
  const [validationError, setValidationError] = useState("");
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Client-side validation: trim name, reject empty/whitespace-only
    const trimmedName = name.trim();
    if (!trimmedName) {
      setValidationError("Name is required.");
      return;
    }

    setValidationError("");
    setApiError("");
    setSubmitting(true);

    const submitAction = isEdit
      ? updateItem(props.itemId, { name: trimmedName, group, author })
      : createItem({ name: trimmedName, group, author });

    submitAction
      .then((item) => {
        if (isEdit) {
          navigate(`/items/${item.id}`);
        } else {
          // Reset form on successful create
          setName("");
          setGroup("Primary");
          navigate(`/items/${item.id}`);
        }
      })
      .catch((error: unknown) => {
        // Extract API error message and preserve form data
        let message = "An unexpected error occurred.";
        if (axios.isAxiosError(error)) {
          const detail = error.response?.data?.detail;
          if (typeof detail === "string") {
            message = detail;
          } else if (Array.isArray(detail) && detail.length > 0) {
            message = detail[0].msg ?? message;
          }
        }
        setApiError(message);
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  return (
    <div className="page">
      <form onSubmit={handleSubmit} noValidate className="form-container">
        <h2>{isEdit ? "Edit Item" : "Create Item"}</h2>

        {apiError && (
          <p role="alert" className="form-api-error">
            {apiError}
          </p>
        )}

        <div className="form-group">
          <label htmlFor="item-name">Name</label>
          <input
            id="item-name"
            type="text"
            maxLength={255}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (validationError) setValidationError("");
            }}
            aria-describedby={validationError ? "name-error" : undefined}
            aria-invalid={!!validationError}
          />
          {validationError && (
            <p id="name-error" role="alert" className="form-error">
              {validationError}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="item-group">Group</label>
          <select
            id="item-group"
            value={group}
            onChange={(e) => setGroup(e.target.value as ItemGroup)}
          >
            <option value="Primary">Primary</option>
            <option value="Secondary">Secondary</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="item-author">Author</label>
          <input
            id="item-author"
            type="text"
            maxLength={50}
            value={author}
            onChange={(e) => {
              setAuthor(e.target.value);
              if (validationError) setValidationError("");
            }}
            aria-describedby={validationError ? "author-error" : undefined}
            aria-invalid={!!validationError}
          />
          {validationError && (
            <p id="author-error" role="alert" className="form-error">
              {validationError}
            </p>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" disabled={submitting} className="btn btn-primary">
            {submitting ? "Saving..." : isEdit ? "Update" : "Create"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
