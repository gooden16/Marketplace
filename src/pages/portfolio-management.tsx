import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePartnerPortal } from "@/context/partner-portal-context";
import { PageHeader } from "@/components/common/page-header";
import { formatCurrency, formatDate, formatPercent } from "@/lib/format";
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Star, StarHalf } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

export function PortfolioManagement() {
  const { portfolio } = usePartnerPortal();
  
  const riskDistributionData = [
    { name: 'Senior Debt', value: 58, color: '#3B82F6' },
    { name: 'Mezzanine', value: 32, color: '#F59E0B' },
    { name: 'Equity', value: 10, color: '#8B5CF6' },
  ];

  const performanceData = [
    { month: 'Jan', actual: 7.2, target: 7.0, benchmark: 6.8 },
    { month: 'Feb', actual: 7.4, target: 7.0, benchmark: 6.9 },
    { month: 'Mar', actual: 7.3, target: 7.0, benchmark: 6.8 },
    { month: 'Apr', actual: 7.5, target: 7.0, benchmark: 6.9 },
    { month: 'May', actual: 7.6, target: 7.0, benchmark: 7.0 },
    { month: 'Jun', actual: 7.8, target: 7.0, benchmark: 7.0 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'current':
        return <Badge className="bg-green-100 text-green-800">Current</Badge>;
      case 'review_required':
        return <Badge className="bg-yellow-100 text-yellow-800">Review Required</Badge>;
      case 'past_due':
        return <Badge className="bg-red-100 text-red-800">Past Due</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getMetricColor = (value: number, threshold: number) => {
    return value >= threshold ? 'text-green-500' : 'text-red-500';
  };

  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-primary text-primary" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-4 h-4 fill-primary text-primary" />);
    }

    return <div className="flex gap-1">{stars}</div>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Portfolio Management"
        description="Monitor and manage your active loan portfolio, performance metrics, and service quality indicators."
      />

      {/* Portfolio Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
                <h3 className="text-2xl font-bold">{formatCurrency(portfolio.summary.totalAssets)}</h3>
              </div>
              <Badge className="bg-green-100 text-green-800 flex gap-1">
                <ArrowUpRight className="w-4 h-4" />
                2.3%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Active Loans</p>
                <h3 className="text-2xl font-bold">{portfolio.summary.activeLoans}</h3>
              </div>
              <Badge className="bg-green-100 text-green-800">+3 this month</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Average Yield</p>
                <h3 className="text-2xl font-bold">{formatPercent(portfolio.summary.avgYield)}</h3>
              </div>
              <Badge className="bg-green-100 text-green-800 flex gap-1">
                <ArrowUpRight className="w-4 h-4" />
                0.2%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Default Rate</p>
                <h3 className="text-2xl font-bold">{formatPercent(portfolio.summary.defaultRate)}</h3>
              </div>
              <Badge className="bg-green-100 text-green-800 flex gap-1">
                <ArrowDownRight className="w-4 h-4" />
                0.1%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="actual" stroke="#3B82F6" name="Actual" />
                  <Line type="monotone" dataKey="target" stroke="#F59E0B" name="Target" />
                  <Line type="monotone" dataKey="benchmark" stroke="#8B5CF6" name="Benchmark" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Loans Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Loans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Loan ID</th>
                  <th className="text-left py-3 px-4">Client</th>
                  <th className="text-right py-3 px-4">Amount</th>
                  <th className="text-right py-3 px-4">Rate</th>
                  <th className="text-center py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Next Payment</th>
                  <th className="text-right py-3 px-4">LTV</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.loans.map((loan) => (
                  <tr
                    key={loan.loanId}
                    className={`border-l-4 ${
                      loan.status === 'current'
                        ? 'border-l-green-500'
                        : loan.status === 'review_required'
                        ? 'border-l-yellow-500'
                        : 'border-l-red-500'
                    }`}
                  >
                    <td className="py-3 px-4">{loan.loanId}</td>
                    <td className="py-3 px-4">{loan.clientName}</td>
                    <td className="py-3 px-4 text-right">
                      {formatCurrency(loan.loanDetails.currentBalance)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {formatPercent(loan.loanDetails.interestRate)}
                    </td>
                    <td className="py-3 px-4 text-center">{getStatusBadge(loan.status)}</td>
                    <td className="py-3 px-4">{formatDate(loan.paymentInfo.nextPaymentDate)}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={loan.collateral.currentLtv > 80 ? 'text-red-500' : ''}>
                        {formatPercent(loan.collateral.currentLtv)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button size="sm">Manage</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Service Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Service Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Payment Performance</p>
              <div className="flex items-center gap-2">
                <Progress value={portfolio.serviceMetrics.paymentPerformance} className="flex-1" />
                <span className={getMetricColor(portfolio.serviceMetrics.paymentPerformance, 95)}>
                  {formatPercent(portfolio.serviceMetrics.paymentPerformance)}
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Documentation Quality</p>
              <div className="flex items-center gap-2">
                <Progress value={portfolio.serviceMetrics.documentationQuality} className="flex-1" />
                <span className={getMetricColor(portfolio.serviceMetrics.documentationQuality, 90)}>
                  {formatPercent(portfolio.serviceMetrics.documentationQuality)}
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Response Time</p>
              <div className="flex items-center gap-2">
                <span className={getMetricColor(4 - portfolio.serviceMetrics.responseTime, 2)}>
                  {portfolio.serviceMetrics.responseTime} hours
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Client Satisfaction</p>
              <div className="flex items-center gap-2">
                {renderStarRating(portfolio.serviceMetrics.clientSatisfaction)}
                <span className="text-sm">
                  ({portfolio.serviceMetrics.clientSatisfaction})
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Platform Reliability</p>
              <div className="flex items-center gap-2">
                <Progress value={portfolio.serviceMetrics.platformReliability} className="flex-1" />
                <span className={getMetricColor(portfolio.serviceMetrics.platformReliability, 99)}>
                  {formatPercent(portfolio.serviceMetrics.platformReliability)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}