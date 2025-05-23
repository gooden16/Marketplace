import { useState } from 'react';
import { usePartnerPortal } from '@/context/partner-portal-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PageHeader } from '@/components/common/page-header';
import { formatCurrency, formatDate, formatPercent } from '@/lib/format';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Star, StarHalf, Trophy, Medal, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Target, Zap, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PortfolioManagement() {
  const { portfolio } = usePartnerPortal();
  
  // Portfolio Health Score calculation (mock data - would be API-driven)
  const healthScore = {
    current: 92,
    change: 3,
    percentile: 92, // Top 8%
    trend: 'up',
  };
  
  // Achievement data
  const achievements = {
    diversification: {
      title: 'Diversification Pro',
      description: 'Balanced risk allocation',
      progress: 100,
      achieved: true,
      color: 'yellow',
    },
    performance: {
      title: 'Performance Leader',
      description: 'Above benchmark 6 months',
      progress: 100,
      achieved: true,
      color: 'green',
    },
    riskManagement: {
      title: 'Risk Master',
      description: '0.2% default rate',
      progress: 100,
      achieved: true,
      color: 'blue',
    },
  };

  // Risk attribution data
  const riskAttribution = {
    interestRate: { impact: 0.8, trend: 'up' },
    riskManagement: { impact: 0.3, trend: 'up' },
    marketConditions: { impact: -0.2, trend: 'down' },
    netAlpha: { impact: 0.9, trend: 'up' },
  };

  // Scenario analysis data
  const scenarios = {
    rateRise: { description: 'Rate Rise (+2%)', impact: 1200000, type: 'positive' },
    stable: { description: 'Stable Rates', impact: 0, type: 'neutral' },
    rateCut: { description: 'Rate Cut (-1%)', impact: -600000, type: 'negative' },
    creditEvent: { description: 'Credit Event', impact: -140000, type: 'risk' },
  };
  
  const riskDistributionData = [
    { name: 'Senior Debt', value: 58, target: 60, color: '#3B82F6' },
    { name: 'Mezzanine', value: 32, target: 30, color: '#F59E0B' },
    { name: 'Equity', value: 10, target: 10, color: '#8B5CF6' },
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

  const getScenarioBadge = (type: string) => {
    switch (type) {
      case 'positive':
        return <Badge className="bg-green-100 text-green-800">Positive Impact</Badge>;
      case 'negative':
        return <Badge className="bg-red-100 text-red-800">Negative Impact</Badge>;
      case 'risk':
        return <Badge className="bg-yellow-100 text-yellow-800">Risk Event</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800">Neutral</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Portfolio Management"
        description="Monitor and manage your active loan portfolio, performance metrics, and service quality indicators."
      />

      {/* Portfolio Health Score */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-serif">Portfolio Health Score</h3>
              <div className="flex items-center gap-2 mt-2">
                <div className="text-4xl font-bold text-green-400">{healthScore.current}</div>
                <div className="text-green-400">
                  <span className="flex items-center gap-1">
                    <ArrowUpRight className="w-4 h-4" />
                    +{healthScore.change} this month
                  </span>
                </div>
              </div>
            </div>
            <Trophy className="w-12 h-12 text-yellow-500" />
          </div>
          <div className="mt-4 text-sm text-gray-300">
            Top {100 - healthScore.percentile}% of all portfolio managers
          </div>
        </CardContent>
      </Card>

      {/* Achievement Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(achievements).map(([key, achievement]) => (
          <Card
            key={key}
            className={cn(
              "bg-opacity-10 border",
              `bg-${achievement.color}-500/10`,
              `border-${achievement.color}-500/30`
            )}
          >
            <CardContent className="pt-4 text-center">
              <div className={`text-${achievement.color}-500 font-bold`}>
                {achievement.title}
              </div>
              <div className="text-xs text-gray-400">{achievement.description}</div>
              {achievement.progress < 100 && (
                <Progress value={achievement.progress} className="mt-2" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

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

      {/* Risk Attribution */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Attribution</CardTitle>
          <CardDescription>Breakdown of portfolio performance factors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(riskAttribution).map(([key, { impact, trend }]) => (
              <div key={key} className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div className="flex items-center gap-2">
                  <span className={impact >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {impact >= 0 ? '+' : ''}{impact}%
                  </span>
                  {trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scenario Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Scenario Analysis</CardTitle>
          <CardDescription>Impact of market scenarios on portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(scenarios).map(([key, scenario]) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{scenario.description}</div>
                  {getScenarioBadge(scenario.type)}
                </div>
                <div className={cn(
                  "text-lg font-bold",
                  scenario.impact >= 0 ? 'text-green-500' : 'text-red-500'
                )}>
                  {formatCurrency(Math.abs(scenario.impact))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution vs Targets</CardTitle>
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
            <div className="mt-4 space-y-2">
              {riskDistributionData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <span>{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span>{item.value}% (Target: {item.target}%)</span>
                    {Math.abs(item.value - item.target) <= 2 ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                </div>
              ))}
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
              <p className="text-xs text-muted-foreground mt-1">
                🏆 Top 5% industry-wide
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Documentation Quality</p>
              <div className="flex items-center gap-2">
                <Progress value={portfolio.serviceMetrics.documentationQuality} className="flex-1" />
                <span className={getMetricColor(portfolio.serviceMetrics.documentationQuality, 90)}>
                  {formatPercent(portfolio.serviceMetrics.documentationQuality)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                📈 Above 90% target
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Response Time</p>
              <div className="flex items-center gap-2">
                <span className={getMetricColor(4 - portfolio.serviceMetrics.responseTime, 2)}>
                  {portfolio.serviceMetrics.responseTime} hours
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                ⚡ 40% faster than average
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Client Satisfaction</p>
              <div className="flex items-center gap-2">
                {renderStarRating(portfolio.serviceMetrics.clientSatisfaction)}
                <span className="text-sm">
                  ({portfolio.serviceMetrics.clientSatisfaction})
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                🌟 Exceeds 4.5 threshold
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Platform Reliability</p>
              <div className="flex items-center gap-2">
                <Progress value={portfolio.serviceMetrics.platformReliability} className="flex-1" />
                <span className={getMetricColor(portfolio.serviceMetrics.platformReliability, 99)}>
                  {formatPercent(portfolio.serviceMetrics.platformReliability)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                ✅ Exceeds 99.5% SLA
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}