import { useState } from 'react';
import { usePartnerPortal } from '@/context/partner-portal-context';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/common/page-header';
import { LoanOpportunity } from '@/types';
import { formatCurrency, formatPercent } from '@/lib/format';
import { AlertTriangle, ArrowUpRight, CheckCircle2, Clock, Download, FileText, Info, Search, Shield, Star } from 'lucide-react';

export function LoanOpportunities() {
  const { opportunities, acceptOpportunity, declineOpportunity } = usePartnerPortal();
  const [selectedOpportunity, setSelectedOpportunity] = useState<LoanOpportunity | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minAmount: 0,
    maxAmount: 50000000,
    riskProfile: {
      senior: true,
      mezzanine: true,
      equity: false,
    },
  });
  
  const handleViewDetails = (opportunity: LoanOpportunity) => {
    setSelectedOpportunity(opportunity);
    setIsDetailOpen(true);
  };
  
  const handleAccept = (id: string) => {
    acceptOpportunity(id);
    setIsDetailOpen(false);
    toast({
      title: "Opportunity Accepted",
      description: "The loan opportunity has been added to your portfolio.",
    });
  };
  
  const handleDecline = (id: string) => {
    declineOpportunity(id);
    setIsDetailOpen(false);
    toast({
      title: "Opportunity Declined",
      description: "The loan opportunity has been declined.",
      variant: "destructive",
    });
  };
  
  const getRiskProfileBadge = (profile: string) => {
    switch (profile) {
      case 'senior':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">Senior</Badge>;
      case 'mezzanine':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">Mezzanine</Badge>;
      case 'equity':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50">Equity</Badge>;
      default:
        return <Badge variant="outline">{profile}</Badge>;
    }
  };

  const getRiskScoreBadge = (score: string) => {
    const getColorClass = (score: string) => {
      if (score.startsWith('A')) return 'bg-green-50 text-green-700';
      if (score.startsWith('B')) return 'bg-yellow-50 text-yellow-700';
      return 'bg-red-50 text-red-700';
    };

    return (
      <Badge variant="outline" className={getColorClass(score)}>
        {score}
      </Badge>
    );
  };
  
  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const hoursRemaining = Math.max(0, Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60)));
    
    if (hoursRemaining === 0) return 'Expired';
    if (hoursRemaining === 1) return '1 hour remaining';
    return `${hoursRemaining} hours remaining`;
  };

  const getTimeRemainingColor = (expiresAt: string) => {
    const hoursRemaining = Math.floor((new Date(expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60));
    if (hoursRemaining <= 4) return 'text-red-600';
    if (hoursRemaining <= 12) return 'text-amber-600';
    return 'text-muted-foreground';
  };

  const getPortfolioFitScore = (opportunity: LoanOpportunity) => {
    // This would be calculated based on partner parameters in a real implementation
    return Math.floor(85 + Math.random() * 10);
  };

  const getDocumentStatus = (opportunity: LoanOpportunity) => {
    // This would check actual document completeness in a real implementation
    return Math.random() > 0.3;
  };
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Pending Loan Opportunities"
        description="Review and approve loan opportunities that match your lending parameters."
      />

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div>
                <Label htmlFor="min-amount">Min Amount</Label>
                <Input
                  id="min-amount"
                  type="number"
                  value={filters.minAmount}
                  onChange={(e) => setFilters({ ...filters, minAmount: Number(e.target.value) })}
                  className="w-32"
                />
              </div>
              <div>
                <Label htmlFor="max-amount">Max Amount</Label>
                <Input
                  id="max-amount"
                  type="number"
                  value={filters.maxAmount}
                  onChange={(e) => setFilters({ ...filters, maxAmount: Number(e.target.value) })}
                  className="w-32"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-6">
        {opportunities.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium">No pending opportunities</h3>
                <p className="text-muted-foreground mt-1">
                  Check back later for new loan opportunities that match your parameters.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          opportunities.map((opportunity) => {
            const portfolioFit = getPortfolioFitScore(opportunity);
            const documentsComplete = getDocumentStatus(opportunity);
            const timeRemaining = getTimeRemaining(opportunity.expiresAt);
            const timeColor = getTimeRemainingColor(opportunity.expiresAt);

            return (
              <Card key={opportunity.opportunityId} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="bg-muted/30 pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex gap-2 items-center">
                        <CardTitle className="text-lg">{opportunity.opportunityId}</CardTitle>
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                          Active
                        </Badge>
                        {getRiskScoreBadge(opportunity.riskAssessment.creditProfile)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Client: {opportunity.clientName}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`flex items-center gap-1 ${timeColor}`}>
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{timeRemaining}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Info className="h-4 w-4" />
                        <span>Portfolio Fit: {portfolioFit}%</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Loan Details</h4>
                      <ul className="text-sm space-y-1">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Amount:</span>
                          <span className="font-medium">{formatCurrency(opportunity.loanDetails.requestedAmount)}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-medium">
                            {opportunity.loanDetails.loanType === 'line_of_credit' 
                              ? 'Line of Credit'
                              : opportunity.loanDetails.loanType === 'term_loan' 
                                ? 'Term Loan' 
                                : 'Hybrid'}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Term:</span>
                          <span className="font-medium">{opportunity.loanDetails.term} months</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Rate:</span>
                          <span className="font-medium">{opportunity.loanDetails.proposedRate}% APR</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Collateral Package</h4>
                      <ul className="text-sm space-y-1">
                        {opportunity.collateralPackage.assets.map((asset, index) => (
                          <li key={index} className="flex justify-between">
                            <span className="text-muted-foreground">{asset.description}:</span>
                            <span className="font-medium">{formatCurrency(asset.value)}</span>
                          </li>
                        ))}
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Advance Rate:</span>
                          <span className="font-medium">{opportunity.collateralPackage.advanceRate}%</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">LTV Ratio:</span>
                          <span className="font-medium">{opportunity.collateralPackage.ltv}%</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Risk Assessment</h4>
                      <ul className="text-sm space-y-1">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Profile:</span>
                          <span className="font-medium">{opportunity.riskAssessment.creditProfile}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Risk Profile:</span>
                          <span>{getRiskProfileBadge(opportunity.loanDetails.riskProfile)}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Concentration:</span>
                          <span className="font-medium capitalize">{opportunity.riskAssessment.concentrationRisk}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Return:</span>
                          <span className="font-medium">{opportunity.financialProjections.riskAdjustedReturn}%</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Document Status */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Documentation Status:</span>
                      </div>
                      {documentsComplete ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Complete
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Missing Items
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 bg-muted/10 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => handleViewDetails(opportunity)}
                  >
                    View Details
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleDecline(opportunity.opportunityId)}
                  >
                    Decline
                  </Button>
                  <Button 
                    onClick={() => handleAccept(opportunity.opportunityId)}
                  >
                    Accept
                  </Button>
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>
      
      {selectedOpportunity && (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex justify-between items-start">
                <div>
                  <DialogTitle>Loan Opportunity - {selectedOpportunity.opportunityId}</DialogTitle>
                  <DialogDescription>
                    Complete underwriting package and analysis
                  </DialogDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-1 ${getTimeRemainingColor(selectedOpportunity.expiresAt)}`}>
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{getTimeRemaining(selectedOpportunity.expiresAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Portfolio Fit: {getPortfolioFitScore(selectedOpportunity)}%</span>
                  </div>
                </div>
              </div>
            </DialogHeader>
            
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="credit">Credit Analysis</TabsTrigger>
                <TabsTrigger value="collateral">Collateral</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="projections">Projections</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Basic Terms</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Principal Amount:</span>
                          <span>{formatCurrency(selectedOpportunity.loanDetails.requestedAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Facility Type:</span>
                          <span>{selectedOpportunity.loanDetails.loanType === 'line_of_credit' ? 'Revolving Line of Credit' : 'Term Loan'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Interest Rate:</span>
                          <span>{selectedOpportunity.loanDetails.proposedRate}% APR</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Term:</span>
                          <span>{selectedOpportunity.loanDetails.term} months</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold mb-2">Fees & Conditions</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Origination Fee:</span>
                          <span>{selectedOpportunity.loanDetails.originationFee}% ({formatCurrency(selectedOpportunity.loanDetails.requestedAmount * selectedOpportunity.loanDetails.originationFee / 100)})</span>
                        </div>
                        {selectedOpportunity.loanDetails.loanType === 'line_of_credit' && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Draw Period:</span>
                            <span>{selectedOpportunity.loanDetails.drawPeriod} months</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Repayment Structure:</span>
                          <span>{selectedOpportunity.loanDetails.repaymentStructure}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-semibold mb-2">Client Information</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Business Type:</span>
                          <span>{selectedOpportunity.clientInfo.businessType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Years in Business:</span>
                          <span>{selectedOpportunity.clientInfo.yearsInBusiness} years</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Annual Revenue:</span>
                          <span>{formatCurrency(selectedOpportunity.clientInfo.annualRevenue)}</span>
                        </div>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Credit Rating:</span>
                          <span>{selectedOpportunity.clientInfo.creditRating} ({selectedOpportunity.clientInfo.ratingAgency})</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Risk Profile:</span>
                          <span>{getRiskProfileBadge(selectedOpportunity.loanDetails.riskProfile)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="credit" className="mt-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Credit Assessment</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Credit Profile:</span>
                          <span>{getRiskScoreBadge(selectedOpportunity.riskAssessment.creditProfile)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Concentration Risk:</span>
                          <span className="capitalize">{selectedOpportunity.riskAssessment.concentrationRisk}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Liquidity Risk:</span>
                          <span className="capitalize">{selectedOpportunity.riskAssessment.liquidityRisk}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-semibold mb-2">Stress Test Results</h3>
                    <div className="space-y-2">
                      {selectedOpportunity.riskAssessment.stressTestResults.map((test, index) => (
                        <div key={index} className="bg-muted/20 p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{test.scenario}</span>
                            <Badge
                              variant="outline"
                              className={test.outcome === 'pass' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}
                            >
                              {test.outcome === 'pass' ? 'Pass' : 'Fail'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{test.description}</p>
                          <div className="mt-2">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Value Impact:</span>
                              <span className={test.valueImpact >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {test.valueImpact >= 0 ? '+' : ''}{test.valueImpact}%
                              </span>
                            </div>
                            <Progress
                              value={100 - Math.abs(test.valueImpact)}
                              className="h-2"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="collateral" className="mt-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Collateral Summary</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Value:</span>
                          <span>{formatCurrency(selectedOpportunity.collateralPackage.totalValue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Advance Rate:</span>
                          <span>{selectedOpportunity.collateralPackage.advanceRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">LTV Ratio:</span>
                          <span>{selectedOpportunity.collateralPackage.ltv}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-semibold mb-2">Asset Details</h3>
                    <div className="space-y-4">
                      {selectedOpportunity.collateralPackage.assets.map((asset, index) => (
                        <div key={index} className="bg-muted/20 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium">{asset.description}</h4>
                              {asset.custodian && (
                                <p className="text-sm text-muted-foreground">Custodian: {asset.custodian}</p>
                              )}
                            </div>
                            <span className="font-medium">{formatCurrency(asset.value)}</span>
                          </div>
                          {asset.assetMix && (
                            <div className="mt-2">
                              <p className="text-sm font-medium mb-1">Asset Allocation</p>
                              <div className="grid grid-cols-4 gap-2">
                                <div className="text-center p-2 bg-muted/30 rounded">
                                  <div className="text-sm font-medium">{asset.assetMix.equities}%</div>
                                  <div className="text-xs text-muted-foreground">Equities</div>
                                </div>
                                <div className="text-center p-2 bg-muted/30 rounded">
                                  <div className="text-sm font-medium">{asset.assetMix.bonds}%</div>
                                  <div className="text-xs text-muted-foreground">Bonds</div>
                                </div>
                                <div className="text-center p-2 bg-muted/30 rounded">
                                  <div className="text-sm font-medium">{asset.assetMix.cash}%</div>
                                  <div className="text-xs text-muted-foreground">Cash</div>
                                </div>
                                <div className="text-center p-2 bg-muted/30 rounded">
                                  <div className="text-sm font-medium">{asset.assetMix.other}%</div>
                                  <div className="text-xs text-muted-foreground">Other</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="mt-4">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Financial Statements</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li className="flex items-center justify-between">
                            <span className="text-sm">Audited Financials 2024</span>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-sm">YTD Financials 2025</span>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-sm">Tax Returns 2024</span>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Collateral Documents</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li className="flex items-center justify-between">
                            <span className="text-sm">Asset Statements</span>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-sm">Valuation Reports</span>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="projections" className="mt-4">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Financial Projections</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Monthly Interest:</span>
                          <span>{formatCurrency(selectedOpportunity.financialProjections.expectedMonthlyInterest)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Fee Income:</span>
                          <span>{formatCurrency(selectedOpportunity.financialProjections.feeIncome)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Risk-Adjusted Return:</span>
                          <span>{selectedOpportunity.financialProjections.riskAdjustedReturn}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="mt-6">
              <div className="flex justify-between w-full">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDetailOpen(false)}
                >
                  Cancel
                </Button>
                <div className="flex gap-2">
                  <Button 
                    variant="destructive" 
                    onClick={() => handleDecline(selectedOpportunity.opportunityId)}
                  >
                    Decline Opportunity
                  </Button>
                  <Button 
                    onClick={() => handleAccept(selectedOpportunity.opportunityId)}
                  >
                    Accept Opportunity
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}