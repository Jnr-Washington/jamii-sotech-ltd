import { useState } from 'react'
import './App.css'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import JamiiSoTechHomepage from './home';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<JamiiSoTechHomepage />} />
      </Routes>
    </Router>
  )
}

export default App
