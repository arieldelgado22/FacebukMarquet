import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { Outlet } from 'react-router-dom';
import "./Layout.css";

export function Layout() {
  return (
    <div className="container-main">
     <Header />
      <main>
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
}
