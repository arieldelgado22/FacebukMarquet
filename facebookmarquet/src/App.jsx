import { Layout } from './Componentes/Layout/Layout';
import { Navigate, Routes, Route } from 'react-router-dom';
import './App.css'
import { ItemListContainer } from
  './Componentes/Item/ItemListContainer';
import Cart from './Componentes/Cart/Cart';
import { FormularioContainer } from "./Componentes/FormularioProductos/FormularioContainer";
import ProductosNacionales from './Componentes/Productos/ProductoNacionales';
import ProductosNacionalesDetalle from './Componentes/Productos/ProductosNacionalesDetalle';
import Gestion from './Componentes/Gestion/Gestion';
import Login from './Componentes/Auth/Login';
import ProtectedRoute from './Componentes/Auth/ProtectedRoute';
function App() {


  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<ItemListContainer Mensaje="Productos nacionales destacados" />} />
        <Route path="/productos" element={<Navigate replace to="/productos-nacionales" />} />
        <Route path="/productos/:id" element={<Navigate replace to="/productos-nacionales" />} />
        <Route path="/carrito" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/formulario" element={<ProtectedRoute requireAdmin><section className="marketplace-shell"><FormularioContainer /></section></ProtectedRoute>} />
        <Route path="/gestion" element={<ProtectedRoute requireAdmin><Gestion /></ProtectedRoute>} />
        <Route path="/productos-nacionales/:id" element={<ProductosNacionalesDetalle />} />
        <Route path="/productos-nacionales/" element={<ProductosNacionales />}  />
      </Route>
    </Routes>
  );
}


export default App;
