import { Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import ItemList from "./components/ItemList";
import ItemDetail from "./components/ItemDetail";
import ItemForm from "./components/ItemForm";
import EditItemPage from "./pages/EditItemPage";

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<ItemList />} />
        <Route path="/items" element={<Navigate to="/" replace />} />
        <Route path="/items/new" element={<ItemForm mode="create" />} />
        <Route path="/items/:id" element={<ItemDetail />} />
        <Route path="/items/:id/edit" element={<EditItemPage />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
