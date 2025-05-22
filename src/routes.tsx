import { Routes, Route, Navigate } from 'react-router-dom';
import { PartnerProfile } from '@/pages/partner-profile';
import { LoanOpportunities } from '@/pages/loan-opportunities';
import { PortfolioManagement } from '@/pages/portfolio-management';
import { NotFound } from '@/pages/not-found';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PartnerProfile />} />
      <Route path="/opportunities" element={<LoanOpportunities />} />
      <Route path="/portfolio" element={<PortfolioManagement />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}