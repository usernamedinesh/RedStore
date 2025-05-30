// CreateProductBTN.jsx
import { useState } from "react";
import ModalForm from "../customComponents/ModelForm";

export function CreateProductBTN() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Create Product
      </button>

      {showForm && <ModalForm onClose={() => setShowForm(false)} />}
    </>
  );
}
