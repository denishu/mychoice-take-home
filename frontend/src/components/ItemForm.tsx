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

  const [name, setName] = useState(initialName);
  const [group, setGroup] = useState<ItemGroup>(initialGroup);
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
      ? updateItem(props.itemId, { name: trimmedName, group })
      : createItem({ name: trimmedName, group });

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
    <form onSubmit={handleSubmit} noValidate>
      <h2>{isEdit ? "Edit Item" : "Create Item"}</h2>

      <div>
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
          <p id="name-error" role="alert" style={{ color: "red" }}>
            {validationError}
          </p>
        )}
      </div>

      <div>
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

      {apiError && (
        <p role="alert" style={{ color: "red" }}>
          {apiError}
        </p>
      )}

      <button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : isEdit ? "Update" : "Create"}
      </button>
    </form>
  );
}
