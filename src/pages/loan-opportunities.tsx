import { useState } from 'react';
import { usePartnerPortal } from '@/context/partner-portal-context';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/common/page-header';
import { LoanOpportunity } from '@/types';
import { formatCurrency } from '@/lib/format';

export function LoanOpportunities() {
  const { opportunities, acceptOpportunity, declineOpportunity } = usePartnerPortal();
  const [selectedOpportunity, setSelectedOpportunity] = useState<LoanOpportunity | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
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
  
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const diffHours = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours === 1) return '1 hour ago';
    return `${diffHours} hours ago`;
  };
  
  return (
    <div>
      <PageHeader 
        title="Pending Loan Opportunities"
        description="Review and approve loan opportunities that match your lending parameters."
      />
      
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
          opportunities.map((opportunity) => (
            <Card key={opportunity.opportunityId} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="bg-muted/30 pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex gap-2 items-center">
                      <CardTitle className="text-lg">{opportunity.opportunityId}</CardTitle>
                      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Client: {opportunity.clientName}
                    </p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    Submitted: {getTimeAgo(opportunity.submittedAt)}
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
          ))
        )}
      </div>
      
      {selectedOpportunity && (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Loan Opportunity Details - {selectedOpportunity.opportunityId}</DialogTitle>
              <DialogDescription>
                Review complete details about this loan opportunity
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold mb-2">Client Information</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Business Type:</span>
                    <span>{selectedOpportunity.clientInfo.businessType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Years in Business:</span>
                    <span>{selectedOpportunity.clientInfo.yearsInBusiness}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Annual Revenue:</span>
                    <span>{formatCurrency(selectedOpportunity.clientInfo.annualRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Credit Rating:</span>
                    <span>{selectedOpportunity.clientInfo.creditRating} ({selectedOpportunity.clientInfo.ratingAgency})</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <h3 className="text-sm font-semibold mb-2">Loan Structure</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Principal:</span>
                    <span>{formatCurrency(selectedOpportunity.loanDetails.requestedAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Interest Rate:</span>
                    <span>{selectedOpportunity.loanDetails.proposedRate}% APR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Origination Fee:</span>
                    <span>{selectedOpportunity.loanDetails.originationFee}%</span>
                  </div>
                  {selectedOpportunity.loanDetails.drawPeriod && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Draw Period:</span>
                      <span>{selectedOpportunity.loanDetails.drawPeriod} months</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Repayment:</span>
                    <span>{selectedOpportunity.loanDetails.repaymentStructure}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold mb-2">Collateral Analysis</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Value:</span>
                    <span>{formatCurrency(selectedOpportunity.collateralPackage.totalValue)}</span>
                  </div>
                  {selectedOpportunity.collateralPackage.assets[0].assetMix && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Asset Mix:</span>
                      <span>
                        {selectedOpportunity.collateralPackage.assets[0].assetMix.equities}% Equities, 
                        {selectedOpportunity.collateralPackage.assets[0].assetMix.bonds}% Bonds, 
                        {selectedOpportunity.collateralPackage.assets[0].assetMix.cash}% Cash
                      </span>
                    </div>
                  )}
                  {selectedOpportunity.collateralPackage.assets[0].custodian && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Custodian:</span>
                      <span>{selectedOpportunity.collateralPackage.assets[0].custodian}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valuation Method:</span>
                    <span>Daily mark-to-market</span>
                  </div>
                  
                  {selectedOpportunity.riskAssessment.stressTestResults.map((test, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-muted-foreground">Stress Test ({test.scenario}):</span>
                      <span className={test.outcome === 'pass' ? 'text-green-600' : 'text-red-600'}>
                        {test.outcome === 'pass' ? 'Passes' : 'Fails'}
                      </span>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <h3 className="text-sm font-semibold mb-2">Cash Flow Projections</h3>
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
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDetailOpen(false)}
              >
                Cancel
              </Button>
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
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}