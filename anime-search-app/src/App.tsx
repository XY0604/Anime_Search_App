import {Routes, Route, BrowserRouter} from 'react-router-dom'

import DetailPage from './pages/DetailPage'
import HomePage from './pages/HomePage'



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/anime" element={<HomePage />} />
        <Route path="/anime/:id" element={<DetailPage />} />
      </Routes>
    </BrowserRouter>
      
  )
}

export default App
