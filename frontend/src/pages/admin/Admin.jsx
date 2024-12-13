import "./Admin.css";
import Navbar from "../../components/layout/admin/navbar/Navbar";
import ProductForm from "../../components/layout/admin/productForm/ProductForm";
import DraftSection from "../../components/layout/admin/draftSection/draftSection";
import { useState } from "react";

export default function Admin() {
  const [draftProduct, setDraftProduct] = useState([]);

  const getDraftProduct = (draftProduct) => {
    setDraftProduct(draftProduct);
  };

  return (
    <div>
      <Navbar />
      <main className="form-container">
        <section>
          <div className="form-header">
            <h1 className="form-title">Add Product</h1>
          </div>
          <ProductForm getDraftProduct={getDraftProduct} />
        </section>
        <section>
          <DraftSection draftProducts={draftProduct} />
        </section>
      </main>
    </div>
  );
}
