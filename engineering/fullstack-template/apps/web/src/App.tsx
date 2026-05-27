import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// TODO: import page components here

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* TODO: add routes based on TDD page planning */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
