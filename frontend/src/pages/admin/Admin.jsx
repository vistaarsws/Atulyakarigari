import "./Admin.css";
import Navbar from "../../components/layout/admin/navbar/Navbar";
import ProductForm from "../../components/layout/admin/product-form/ProductForm";
import DraftSection from "../../components/layout/admin/draft-section/DraftSection";

export default function Admin() {
  return (
    <div>
      <Navbar />
      <main className="form-container">
        <section>
          <div className="form-header">
            <h1 className="form-title">Add Product</h1>
          </div>
          <ProductForm />
        </section>
        <section>
          <DraftSection />
        </section>
      </main>
    </div>
  );
}
