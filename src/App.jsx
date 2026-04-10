import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import UserList    from './componentes/UserList'
import AddUser     from './componentes/AddUser'
import EditUser    from './componentes/EditUser'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"               element={<Navigate to="/users" replace />} />
        <Route path="/users"          element={<UserList />} />
        <Route path="/add-user"       element={<AddUser />} />
        <Route path="/edit-user"      element={<EditUser />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App