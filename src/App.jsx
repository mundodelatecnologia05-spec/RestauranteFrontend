import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import UserList    from './componentes/UserList'
import AddUser     from './componentes/AddUser'
import EditUser    from './componentes/EditUser'
import AdminPanel  from './componentes/AdminPanel'
import CreateMenu  from './componentes/CreateMenu'
import EditProduct from './componentes/EditProduct'
import AddProduct  from './componentes/AddProduct'
import Tables from "./componentes/Tables"
import AddTables from "./componentes/AddTables"
import EditTables from "./componentes/EditTables"
import Waiter from "./componentes/Waiter"
import Login       from './componentes/login'
import Reports from './componentes/Reports'
import OpeningBox from "./componentes/OpeningBox"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirige la raíz al login */}
        <Route path="/"             element={<Navigate to="/login" replace />} />

        {/* Autenticación */}
        <Route path="/login"        element={<Login />} />

        {/* Panel principal — destino tras el login */}
        <Route path="/panel-admin"  element={<AdminPanel />} />

        {/* Usuarios */}
        <Route path="/users"        element={<UserList />} />
        <Route path="/add-user"     element={<AddUser />} />
        <Route path="/edit-user"    element={<EditUser />} />
        <Route path='/waiter'       element={<Waiter/>} />

        {/* Mesas */}
        <Route path="/tables"    element={<Tables />} />
        <Route path="/add-tables"    element={<AddTables />} />
        <Route path="/edit-tables"    element={<EditTables />} />

        {/* Reportes */}
        <Route path="/reports"    element={<Reports />} />

        <Route path="/Opening"    element={<OpeningBox />} />

        {/* Menú y productos */}
        <Route path="/create-menu"  element={<CreateMenu />} />
        <Route path="/add-product"  element={<AddProduct />} />
        <Route path="/edit-product" element={<EditProduct />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App