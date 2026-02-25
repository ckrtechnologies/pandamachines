import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Quotation from "../../users/Quotation";

const AdminAddQuotation = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleClose = () => {
    navigate("/admin-quotations");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
          {id ? "Edit Quotation" : "Add New Quotation"}
        </h1>
        <Quotation onClose={handleClose} isPage={true} editId={id} />
      </div>
    </div>
  );
};

export default AdminAddQuotation;
