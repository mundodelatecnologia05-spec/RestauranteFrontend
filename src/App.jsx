import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import UserList    from './componentes/UserList'
import AddUser     from './componentes/AddUser'
import EditUser    from './componentes/EditUser'
import AdminPanel from './componentes/AdminPanel'
import CreateMenu from './componentes/CreateMenu'
import EditProduct from './componentes/EditProduct'
import AddProduct from './componentes/AddProduct'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"               element={<Navigate to="/users" replace />} />
        <Route path="/users"          element={<UserList />} />
        <Route path="/add-user"       element={<AddUser />} />
        <Route path="/edit-user"      element={<EditUser />} />
        <Route path='/create-menu'    element={<CreateMenu/>} />
        <Route path='/add-product'    element={<AddProduct/>} />
        <Route path='/edit-product'    element={<EditProduct/>} />
        <Route path="/panel-admin"      element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App