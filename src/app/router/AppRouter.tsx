import { Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { ROUTES } from '../../shared/constants';
import { DashboardPage } from '../../pages/dashboard/DashboardPage';
import { UploadPage } from '../../pages/upload/UploadPage';
import { HistoryPage } from '../../pages/history/HistoryPage';
import { AnalysisDetailPage } from '../../pages/detail/AnalysisDetailPage';
import { ReportsPage } from '../../pages/reports/ReportsPage';
import { InsightsPage } from '../../pages/insights/InsightsPage';
import { IndicatorsPage } from '../../pages/indicators/IndicatorsPage';
import { MitrePage } from '../../pages/mitre/MitrePage';
import { ThreatsPage } from '../../pages/threats/ThreatsPage';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={ROUTES.dashboard} element={<DashboardPage />} />
        <Route path={ROUTES.upload} element={<UploadPage />} />
        <Route path={ROUTES.history} element={<HistoryPage />} />
        <Route path="/analysis/:id" element={<AnalysisDetailPage />} />
        <Route path={ROUTES.reports} element={<ReportsPage />} />
        <Route path={ROUTES.insights} element={<InsightsPage />} />
        <Route path={ROUTES.indicators} element={<IndicatorsPage />} />
        <Route path={ROUTES.mitre} element={<MitrePage />} />
        <Route path={ROUTES.threats} element={<ThreatsPage />} />
        <Route path="*" element={<Navigate to={ROUTES.dashboard} replace />} />
      </Route>
    </Routes>
  );
}
