import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import CataloguePage from './pages/CataloguePage';
import TemplatesPage from './pages/TemplatesPage';
import EditorPage from './pages/EditorPage';
import DashboardPage from './pages/DashboardPage';
import MyChartsPage from './pages/MyChartsPage';
import ReportsPage from './pages/ReportsPage';

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<CataloguePage />} />
          <Route path="/my-charts" element={<MyChartsPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/edit/:typeId" element={<EditorPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
