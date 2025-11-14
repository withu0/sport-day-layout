import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TemplateList from './pages/TemplateList';
import PhotoEditor from './pages/PhotoEditor';
import LayoutEditor from './pages/LayoutEditor';
import './App.css'
import Demo from './pages/Demo';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<LayoutEditor />} />
          <Route path="/editor/:templateId" element={<PhotoEditor />} />
          <Route path="/list" element={<TemplateList />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
