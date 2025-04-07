import { BrowserRouter,Routes,Route } from 'react-router-dom';
import './App.css';
import Layout from './views/Layout';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/layout" element={<Layout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
