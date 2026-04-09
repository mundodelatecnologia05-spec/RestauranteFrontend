import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AddUser from './componentes/AddUser'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/add-user" replace />} />
        <Route path="/add-user" element={<AddUser />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App