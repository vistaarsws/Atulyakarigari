import "./Admin.css";
import Navbar from "../../components/layout/admin/navbar/Navbar";

import { Outlet } from "react-router-dom";

export default function Admin() {
  return (
    <>
      <Navbar />
      <section>
        <Outlet />
      </section>
    </>
  );
}
