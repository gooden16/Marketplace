// Partner Profile Types
export interface PartnerProfile {
  partnerId: string;
  partnerName: string;
  balanceSheetCapacity: {
    totalCapacity: number;
    currentUtilization: number;
    tierCapacities: {
      tier1: { min: number; max: number; available: number };
      tier2: { min: number; max: number; available: number };
      tier3: { min: number; max: number; available: number };
    };
  };
  yieldRequirements: {
    seniorDebt: { minimum: number; target: number };
    mezzanine: { minimum: number; target: number };
    equity: { minimum: number; target: number };
  };
  riskProfiles: {
    seniorDebt: { enabled: boolean; targetAllocation: number };
    mezzanine: { enabled: boolean; targetAllocation: number };
    equity: { enabled: boolean; targetAllocation: number };
  };
  collateralSupport: {
    financialAssets: { enabled: boolean; advanceRate: number };
    realEstate: { enabled: boolean; advanceRate: number };
    businessAssets: { enabled: boolean; advanceRate: number };
    personalProperty: { enabled: boolean; advanceRate: number };
  };
  lastUpdated: string;
  isActive: boolean;
}

// Loan Opportunity Types
export interface CollateralAsset {
  type: string;
  description: string;
  value: number;
  custodian?: string;
  assetMix?: {
    equities: number;
    bonds: number;
    cash: number;
    other: number;
  };
}

export interface StressTestResult {
  scenario: string;
  outcome: 'pass' | 'fail';
  description: string;
  valueImpact: number;
}

export interface LoanOpportunity {
  opportunityId: string;
  clientId: string;
  clientName: string;
  status: 'active' | 'pending' | 'expired' | 'withdrawn';
  submittedAt: string;
  expiresAt: string;
  loanDetails: {
    requestedAmount: number;
    loanType: 'line_of_credit' | 'term_loan' | 'hybrid';
    riskProfile: 'senior' | 'mezzanine' | 'equity';
    term: number; // months
    proposedRate: number;
    originationFee: number;
    drawPeriod?: number; // months for LOC
    repaymentStructure: string;
  };
  clientInfo: {
    businessType: string;
    yearsInBusiness: number;
    annualRevenue: number;
    creditRating: string;
    ratingAgency: string;
  };
  collateralPackage: {
    totalValue: number;
    advanceRate: number;
    ltv: number;
    assets: CollateralAsset[];
  };
  riskAssessment: {
    creditProfile: string;
    concentrationRisk: 'low' | 'medium' | 'high';
    liquidityRisk: 'low' | 'medium' | 'high';
    stressTestResults: StressTestResult[];
  };
  financialProjections: {
    expectedMonthlyInterest: number;
    feeIncome: number;
    riskAdjustedReturn: number;
  };
}

// Portfolio Types
export interface PaymentRecord {
  date: string;
  amount: number;
  status: 'paid' | 'late' | 'missed';
  daysLate: number;
}

export interface LoanAlert {
  type: 'margin_call' | 'payment_due' | 'maturity' | 'covenant_breach' | 'info';
  message: string;
  severity: 'low' | 'medium' | 'high';
  date: string;
  resolved: boolean;
}

export interface PortfolioLoan {
  loanId: string;
  clientId: string;
  clientName: string;
  status: 'current' | 'review_required' | 'past_due' | 'default';
  loanDetails: {
    originalAmount: number;
    currentBalance: number;
    interestRate: number;
    riskProfile: 'senior' | 'mezzanine' | 'equity';
    originationDate: string;
    maturityDate: string;
  };
  collateral: {
    currentValue: number;
    lastValuationDate: string;
    currentLtv: number;
    marginCallThreshold: number;
  };
  paymentInfo: {
    nextPaymentDate: string;
    nextPaymentAmount: number;
    paymentHistory: PaymentRecord[];
    daysPastDue: number;
  };
  performance: {
    ytdReturn: number;
    totalReturn: number;
    riskAdjustedReturn: number;
  };
  alerts: LoanAlert[];
}