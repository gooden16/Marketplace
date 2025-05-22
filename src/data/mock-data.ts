import { PartnerProfile, LoanOpportunity, PortfolioLoan } from '@/types';

// Mock Partner Profile
export const mockPartnerProfile: PartnerProfile = {
  partnerId: 'partner-123',
  partnerName: 'ABC Lending',
  balanceSheetCapacity: {
    totalCapacity: 50000000,
    currentUtilization: 12500000,
    tierCapacities: {
      tier1: { min: 1000000, max: 5000000, available: 15000000 },
      tier2: { min: 5000000, max: 25000000, available: 20000000 },
      tier3: { min: 25000000, max: 100000000, available: 2500000 },
    },
  },
  yieldRequirements: {
    seniorDebt: { minimum: 6.5, target: 7.0 },
    mezzanine: { minimum: 9.5, target: 10.5 },
    equity: { minimum: 15.0, target: 18.0 },
  },
  riskProfiles: {
    seniorDebt: { enabled: true, targetAllocation: 60 },
    mezzanine: { enabled: true, targetAllocation: 30 },
    equity: { enabled: false, targetAllocation: 10 },
  },
  collateralSupport: {
    financialAssets: { enabled: true, advanceRate: 80 },
    realEstate: { enabled: true, advanceRate: 70 },
    businessAssets: { enabled: false, advanceRate: 60 },
    personalProperty: { enabled: false, advanceRate: 50 },
  },
  lastUpdated: new Date().toISOString(),
  isActive: true,
};

// Mock Loan Opportunities
export const mockOpportunities: LoanOpportunity[] = [
  {
    opportunityId: 'LO-2025-0143',
    clientId: 'client-456',
    clientName: 'Manufacturing Company A',
    status: 'active',
    submittedAt: new Date(new Date().setHours(new Date().getHours() - 2)).toISOString(),
    expiresAt: new Date(new Date().setHours(new Date().getHours() + 22)).toISOString(),
    loanDetails: {
      requestedAmount: 3200000,
      loanType: 'line_of_credit',
      riskProfile: 'senior',
      term: 36, // months
      proposedRate: 6.8,
      originationFee: 1.0,
      drawPeriod: 12,
      repaymentStructure: 'Interest-only during draw, then P&I',
    },
    clientInfo: {
      businessType: 'Manufacturing',
      yearsInBusiness: 15,
      annualRevenue: 25000000,
      creditRating: 'A-',
      ratingAgency: 'Moody\'s',
    },
    collateralPackage: {
      totalValue: 4800000,
      advanceRate: 75,
      ltv: 67,
      assets: [
        {
          type: 'investment_portfolio',
          description: 'Investment Portfolio (Schwab)',
          value: 4800000,
          custodian: 'Charles Schwab',
          assetMix: {
            equities: 60,
            bonds: 30,
            cash: 10,
            other: 0,
          },
        },
      ],
    },
    riskAssessment: {
      creditProfile: 'A-',
      concentrationRisk: 'low',
      liquidityRisk: 'low',
      stressTestResults: [
        {
          scenario: '30% market decline',
          outcome: 'pass',
          description: 'Portfolio maintains sufficient value',
          valueImpact: -30,
        },
      ],
    },
    financialProjections: {
      expectedMonthlyInterest: 18133,
      feeIncome: 32000,
      riskAdjustedReturn: 7.2,
    },
  },
  {
    opportunityId: 'LO-2025-0144',
    clientId: 'client-789',
    clientName: 'Real Estate Holdings LLC',
    status: 'active',
    submittedAt: new Date(new Date().setHours(new Date().getHours() - 4)).toISOString(),
    expiresAt: new Date(new Date().setHours(new Date().getHours() + 20)).toISOString(),
    loanDetails: {
      requestedAmount: 8500000,
      loanType: 'term_loan',
      riskProfile: 'mezzanine',
      term: 60,
      proposedRate: 10.2,
      originationFee: 1.5,
      repaymentStructure: 'Interest-only for 24 months, then amortizing',
    },
    clientInfo: {
      businessType: 'Real Estate',
      yearsInBusiness: 8,
      annualRevenue: 12000000,
      creditRating: 'BBB+',
      ratingAgency: 'S&P',
    },
    collateralPackage: {
      totalValue: 12000000,
      advanceRate: 70,
      ltv: 71,
      assets: [
        {
          type: 'commercial_real_estate',
          description: 'Office Building - Downtown Metro',
          value: 12000000,
        },
      ],
    },
    riskAssessment: {
      creditProfile: 'BBB+',
      concentrationRisk: 'medium',
      liquidityRisk: 'medium',
      stressTestResults: [
        {
          scenario: '20% value decline',
          outcome: 'pass',
          description: 'Property maintains sufficient value',
          valueImpact: -20,
        },
      ],
    },
    financialProjections: {
      expectedMonthlyInterest: 72250,
      feeIncome: 127500,
      riskAdjustedReturn: 10.8,
    },
  },
];

// Mock Portfolio Loans
export const mockPortfolioLoans: PortfolioLoan[] = [
  {
    loanId: 'BF-2024-0089',
    clientId: 'client-234',
    clientName: 'Tech Startup B',
    status: 'review_required',
    loanDetails: {
      originalAmount: 2100000,
      currentBalance: 2100000,
      interestRate: 9.5,
      riskProfile: 'mezzanine',
      originationDate: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString(),
      maturityDate: new Date(new Date().setMonth(new Date().getMonth() + 33)).toISOString(),
    },
    collateral: {
      currentValue: 3200000,
      lastValuationDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
      currentLtv: 66,
      marginCallThreshold: 80,
    },
    paymentInfo: {
      nextPaymentDate: new Date(new Date().setDate(25)).toISOString(),
      nextPaymentAmount: 16625,
      paymentHistory: [
        {
          date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
          amount: 16625,
          status: 'paid',
          daysLate: 0,
        },
        {
          date: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString(),
          amount: 16625,
          status: 'paid',
          daysLate: 0,
        },
      ],
      daysPastDue: 0,
    },
    performance: {
      ytdReturn: 9.5,
      totalReturn: 9.5,
      riskAdjustedReturn: 8.7,
    },
    alerts: [
      {
        type: 'info',
        message: 'Quarterly financial statements review due',
        severity: 'medium',
        date: new Date().toISOString(),
        resolved: false,
      },
    ],
  },
  {
    loanId: 'BF-2024-0156',
    clientId: 'client-345',
    clientName: 'Manufacturing C',
    status: 'current',
    loanDetails: {
      originalAmount: 5800000,
      currentBalance: 5800000,
      interestRate: 6.9,
      riskProfile: 'senior',
      originationDate: new Date(new Date().setMonth(new Date().getMonth() - 5)).toISOString(),
      maturityDate: new Date(new Date().setMonth(new Date().getMonth() + 31)).toISOString(),
    },
    collateral: {
      currentValue: 8100000,
      lastValuationDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
      currentLtv: 72,
      marginCallThreshold: 85,
    },
    paymentInfo: {
      nextPaymentDate: new Date(new Date().setDate(1)).toISOString(),
      nextPaymentAmount: 33408,
      paymentHistory: [
        {
          date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
          amount: 33408,
          status: 'paid',
          daysLate: 0,
        },
        {
          date: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString(),
          amount: 33408,
          status: 'paid',
          daysLate: 0,
        },
      ],
      daysPastDue: 0,
    },
    performance: {
      ytdReturn: 6.9,
      totalReturn: 6.9,
      riskAdjustedReturn: 6.5,
    },
    alerts: [],
  },
];