import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { mockPartnerProfile } from '@/data/mock-data';
import { PartnerProfile, LoanOpportunity, PortfolioLoan } from '@/types';

interface PartnerPortalContextType {
  profile: PartnerProfile;
  updateProfile: (profile: Partial<PartnerProfile>) => void;
  opportunities: LoanOpportunity[];
  portfolio: {
    loans: PortfolioLoan[];
    summary: {
      totalAssets: number;
      availableCapacity: number;
      activeLoans: number;
      utilization: number;
      avgYield: number;
      defaultRate: number;
    };
    serviceMetrics: {
      paymentPerformance: number;
      documentationQuality: number;
      responseTime: number;
      clientSatisfaction: number;
      platformReliability: number;
    };
  };
  acceptOpportunity: (id: string) => void;
  declineOpportunity: (id: string) => void;
  counterOfferOpportunity: (id: string, terms: any) => void;
}

const PartnerPortalContext = createContext<PartnerPortalContextType | undefined>(undefined);

export function PartnerPortalProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<PartnerProfile>(mockPartnerProfile);
  const [opportunities, setOpportunities] = useState<LoanOpportunity[]>([]);
  const [portfolioLoans, setPortfolioLoans] = useState<PortfolioLoan[]>([]);

  // Load mock data
  useEffect(() => {
    // This would be replaced with actual API calls in a real implementation
    import('@/data/mock-data').then((data) => {
      setOpportunities(data.mockOpportunities);
      setPortfolioLoans(data.mockPortfolioLoans);
    });
  }, []);

  // Calculate portfolio summary metrics
  const portfolioSummary = {
    totalAssets: portfolioLoans.reduce((sum, loan) => sum + loan.loanDetails.currentBalance, 0),
    availableCapacity: profile.balanceSheetCapacity.totalCapacity - 
      portfolioLoans.reduce((sum, loan) => sum + loan.loanDetails.currentBalance, 0),
    activeLoans: portfolioLoans.length,
    utilization: portfolioLoans.length ? 
      (portfolioLoans.reduce((sum, loan) => sum + loan.loanDetails.currentBalance, 0) / 
       profile.balanceSheetCapacity.totalCapacity) * 100 : 0,
    avgYield: portfolioLoans.length ? 
      portfolioLoans.reduce((sum, loan) => sum + loan.loanDetails.interestRate, 0) / portfolioLoans.length : 0,
    defaultRate: 0.2, // Mock value for demo
  };

  // Mock service metrics
  const serviceMetrics = {
    paymentPerformance: 99.8,
    documentationQuality: 94.0,
    responseTime: 2.3,
    clientSatisfaction: 4.7,
    platformReliability: 99.9,
  };

  const updateProfile = (updatedProfile: Partial<PartnerProfile>) => {
    setProfile(prev => ({ ...prev, ...updatedProfile }));
  };

  const acceptOpportunity = (id: string) => {
    // In a real app, this would call an API
    setOpportunities(prev => 
      prev.filter(opportunity => opportunity.opportunityId !== id)
    );
    
    // For demo purposes, we'll add this to the portfolio
    import('@/data/mock-data').then((data) => {
      const opportunity = data.mockOpportunities.find(o => o.opportunityId === id);
      if (opportunity) {
        const newLoan: PortfolioLoan = {
          loanId: `BF-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
          clientId: opportunity.clientId,
          clientName: opportunity.clientName,
          status: 'current',
          loanDetails: {
            originalAmount: opportunity.loanDetails.requestedAmount,
            currentBalance: opportunity.loanDetails.requestedAmount,
            interestRate: opportunity.loanDetails.proposedRate,
            riskProfile: opportunity.loanDetails.riskProfile,
            originationDate: new Date().toISOString(),
            maturityDate: new Date(new Date().setMonth(new Date().getMonth() + opportunity.loanDetails.term)).toISOString(),
          },
          collateral: {
            currentValue: opportunity.collateralPackage.totalValue,
            lastValuationDate: new Date().toISOString(),
            currentLtv: opportunity.collateralPackage.ltv,
            marginCallThreshold: opportunity.collateralPackage.ltv + 10,
          },
          paymentInfo: {
            nextPaymentDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
            nextPaymentAmount: (opportunity.loanDetails.requestedAmount * (opportunity.loanDetails.proposedRate / 100)) / 12,
            paymentHistory: [],
            daysPastDue: 0,
          },
          performance: {
            ytdReturn: opportunity.loanDetails.proposedRate,
            totalReturn: opportunity.loanDetails.proposedRate,
            riskAdjustedReturn: opportunity.loanDetails.proposedRate * 0.9,
          },
          alerts: [],
        };
        
        setPortfolioLoans(prev => [...prev, newLoan]);
      }
    });
  };

  const declineOpportunity = (id: string) => {
    // In a real app, this would call an API
    setOpportunities(prev => 
      prev.filter(opportunity => opportunity.opportunityId !== id)
    );
  };

  const counterOfferOpportunity = (id: string, terms: any) => {
    // In a real app, this would call an API
    setOpportunities(prev => 
      prev.map(opportunity => 
        opportunity.opportunityId === id 
          ? { ...opportunity, loanDetails: { ...opportunity.loanDetails, ...terms } }
          : opportunity
      )
    );
  };

  const value = {
    profile,
    updateProfile,
    opportunities,
    portfolio: {
      loans: portfolioLoans,
      summary: portfolioSummary,
      serviceMetrics,
    },
    acceptOpportunity,
    declineOpportunity,
    counterOfferOpportunity,
  };

  return (
    <PartnerPortalContext.Provider value={value}>
      {children}
    </PartnerPortalContext.Provider>
  );
}

export const usePartnerPortal = () => {
  const context = useContext(PartnerPortalContext);
  if (context === undefined) {
    throw new Error('usePartnerPortal must be used within a PartnerPortalProvider');
  }
  return context;
};