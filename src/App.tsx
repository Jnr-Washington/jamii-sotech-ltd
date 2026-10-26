import { lazy, Suspense } from 'react'
import './App.css'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import JamiiSoTechHomepage from './home';

// The leads dashboard is only loaded when someone visits /admin
const AdminApp = lazy(() => import('./admin/AdminApp'));

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<JamiiSoTechHomepage />} />
        <Route path="/admin/*" element={<Suspense fallback={null}><AdminApp /></Suspense>} />
      </Routes>
    </Router>
  )
}

export default App
