import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AddUser from './componentes/AddUser'
import EditUser from "./componentes/EditUser"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/add-user" replace />} />
        <Route path="/add-user" element={<AddUser />} />
        <Route path='/edit-user' element={<EditUser/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App