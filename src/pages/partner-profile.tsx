import { useState } from 'react';
import { usePartnerPortal } from '@/context/partner-portal-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/common/page-header';
import { Trophy, Medal, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { formatCurrency, formatPercent } from '@/lib/format';

export function PartnerProfile() {
  const { profile, updateProfile } = usePartnerPortal();
  const [localProfile, setLocalProfile] = useState(profile);
  
  // Competitiveness score calculation (mock data - would be API-driven in production)
  const competitivenessScore = 87;
  const marketRank = 3;
  const totalPartners = 47;
  const scoreChange = "+5";
  
  // Projected metrics based on current parameters
  const projectedMetrics = {
    monthlyVolume: 8200000,
    opportunities: { min: 12, max: 15 },
    competitivePercentile: 78,
    riskProfileMatch: 65,
    optimizedVolume: 12100000,
    optimizedRank: 2,
  };

  // Market benchmarks
  const marketBenchmarks = {
    seniorDebt: 6.2,
    mezzanine: 9.1,
    equity: 14.3,
  };

  const handleSave = () => {
    updateProfile(localProfile);
    toast({
      title: "Settings saved",
      description: "Your lending parameters have been updated.",
    });
  };
  
  const handleReset = () => {
    setLocalProfile(profile);
    toast({
      title: "Reset complete",
      description: "Your changes have been discarded.",
      variant: "destructive",
    });
  };
  
  const utilizationPercentage = (localProfile.balanceSheetCapacity.currentUtilization / 
    localProfile.balanceSheetCapacity.totalCapacity) * 100;

  const getCompetitivenessIcon = (score: number) => {
    if (score >= 85) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (score >= 70) return <Medal className="w-6 h-6 text-gray-400" />;
    return <Medal className="w-6 h-6 text-amber-700" />;
  };

  const getRateComparisonBadge = (rate: number, benchmark: number) => {
    const diff = rate - benchmark;
    if (Math.abs(diff) < 0.1) return null;
    
    return diff > 0 ? (
      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 flex gap-1 items-center">
        <AlertTriangle className="w-3 h-3" />
        Above market median
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-green-50 text-green-700 flex gap-1 items-center">
        <CheckCircle2 className="w-3 h-3" />
        Competitive rate
      </Badge>
    );
  };
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Partner Profile & Lending Parameters"
        description="Configure your lending parameters to match your risk appetite and portfolio objectives."
      />

      {/* Competitiveness Score Card */}
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              {getCompetitivenessIcon(competitivenessScore)}
              <div>
                <h3 className="text-3xl font-bold text-white">{competitivenessScore}</h3>
                <p className="text-slate-300">Competitiveness Score</p>
              </div>
              <Badge className="bg-green-100 text-green-800 flex gap-1">
                <TrendingUp className="w-4 h-4" />
                {scoreChange} points
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-slate-300">
                Rank #{marketRank} of {totalPartners} active partners
              </p>
              <div className="flex gap-4">
                <div>
                  <p className="text-sm text-slate-400">Projected Volume</p>
                  <p className="text-lg font-semibold text-white">
                    {formatCurrency(projectedMetrics.monthlyVolume)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Expected Opportunities</p>
                  <p className="text-lg font-semibold text-white">
                    {projectedMetrics.opportunities.min}-{projectedMetrics.opportunities.max}/mo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader className="bg-muted/30">
            <CardTitle>Balance Sheet Capacity</CardTitle>
            <CardDescription>Configure your available lending capacity</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Current Utilization</span>
                <span className="text-sm font-medium">
                  ${(localProfile.balanceSheetCapacity.currentUtilization / 1000000).toFixed(1)}M of 
                  ${(localProfile.balanceSheetCapacity.totalCapacity / 1000000).toFixed(1)}M ({utilizationPercentage.toFixed(1)}%)
                </span>
              </div>
              <Progress value={utilizationPercentage} className="h-2" />
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-semibold mb-2">Available Capacity by Tier:</h4>
              
              <div className="grid grid-cols-[1fr_2fr] gap-4 items-center">
                <Label htmlFor="tier1-capacity">$1M - $5M</Label>
                <Input
                  id="tier1-capacity"
                  type="number"
                  value={localProfile.balanceSheetCapacity.tierCapacities.tier1.available / 1000000}
                  onChange={(e) => {
                    const value = Number(e.target.value) * 1000000;
                    setLocalProfile({
                      ...localProfile,
                      balanceSheetCapacity: {
                        ...localProfile.balanceSheetCapacity,
                        tierCapacities: {
                          ...localProfile.balanceSheetCapacity.tierCapacities,
                          tier1: {
                            ...localProfile.balanceSheetCapacity.tierCapacities.tier1,
                            available: value,
                          },
                        },
                      },
                    });
                  }}
                  className="max-w-[180px]"
                  min={0}
                  step={0.1}
                />
                
                <Label htmlFor="tier2-capacity">$5M - $25M</Label>
                <Input
                  id="tier2-capacity"
                  type="number"
                  value={localProfile.balanceSheetCapacity.tierCapacities.tier2.available / 1000000}
                  onChange={(e) => {
                    const value = Number(e.target.value) * 1000000;
                    setLocalProfile({
                      ...localProfile,
                      balanceSheetCapacity: {
                        ...localProfile.balanceSheetCapacity,
                        tierCapacities: {
                          ...localProfile.balanceSheetCapacity.tierCapacities,
                          tier2: {
                            ...localProfile.balanceSheetCapacity.tierCapacities.tier2,
                            available: value,
                          },
                        },
                      },
                    });
                  }}
                  className="max-w-[180px]"
                  min={0}
                  step={0.1}
                />
                
                <Label htmlFor="tier3-capacity">$25M+</Label>
                <Input
                  id="tier3-capacity"
                  type="number"
                  value={localProfile.balanceSheetCapacity.tierCapacities.tier3.available / 1000000}
                  onChange={(e) => {
                    const value = Number(e.target.value) * 1000000;
                    setLocalProfile({
                      ...localProfile,
                      balanceSheetCapacity: {
                        ...localProfile.balanceSheetCapacity,
                        tierCapacities: {
                          ...localProfile.balanceSheetCapacity.tierCapacities,
                          tier3: {
                            ...localProfile.balanceSheetCapacity.tierCapacities.tier3,
                            available: value,
                          },
                        },
                      },
                    });
                  }}
                  className="max-w-[180px]"
                  min={0}
                  step={0.1}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="bg-muted/30">
            <CardTitle>Expected Yield Requirements</CardTitle>
            <CardDescription>Set minimum yield requirements by risk profile</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Senior Debt</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{localProfile.yieldRequirements.seniorDebt.minimum}% APR minimum</span>
                    {getRateComparisonBadge(localProfile.yieldRequirements.seniorDebt.minimum, marketBenchmarks.seniorDebt)}
                  </div>
                </div>
                <Slider
                  value={[localProfile.yieldRequirements.seniorDebt.minimum]}
                  min={4}
                  max={10}
                  step={0.1}
                  onValueChange={(value) => {
                    setLocalProfile({
                      ...localProfile,
                      yieldRequirements: {
                        ...localProfile.yieldRequirements,
                        seniorDebt: {
                          ...localProfile.yieldRequirements.seniorDebt,
                          minimum: value[0],
                        },
                      },
                    });
                  }}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Market range: 5.8% - 6.8%</span>
                  <span>Median: {marketBenchmarks.seniorDebt}%</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Mezzanine</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{localProfile.yieldRequirements.mezzanine.minimum}% APR minimum</span>
                    {getRateComparisonBadge(localProfile.yieldRequirements.mezzanine.minimum, marketBenchmarks.mezzanine)}
                  </div>
                </div>
                <Slider
                  value={[localProfile.yieldRequirements.mezzanine.minimum]}
                  min={8}
                  max={14}
                  step={0.1}
                  onValueChange={(value) => {
                    setLocalProfile({
                      ...localProfile,
                      yieldRequirements: {
                        ...localProfile.yieldRequirements,
                        mezzanine: {
                          ...localProfile.yieldRequirements.mezzanine,
                          minimum: value[0],
                        },
                      },
                    });
                  }}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Market range: 8.5% - 10.5%</span>
                  <span>Median: {marketBenchmarks.mezzanine}%</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Equity</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{localProfile.yieldRequirements.equity.minimum}% IRR minimum</span>
                    {getRateComparisonBadge(localProfile.yieldRequirements.equity.minimum, marketBenchmarks.equity)}
                  </div>
                </div>
                <Slider
                  value={[localProfile.yieldRequirements.equity.minimum]}
                  min={12}
                  max={25}
                  step={0.1}
                  onValueChange={(value) => {
                    setLocalProfile({
                      ...localProfile,
                      yieldRequirements: {
                        ...localProfile.yieldRequirements,
                        equity: {
                          ...localProfile.yieldRequirements.equity,
                          minimum: value[0],
                        },
                      },
                    });
                  }}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Market range: 13.5% - 16.5%</span>
                  <span>Median: {marketBenchmarks.equity}%</span>
                </div>
              </div>
            </div>

            {/* What-if Scenario */}
            <Card className="bg-muted/20 border-dashed">
              <CardContent className="pt-4">
                <h4 className="text-sm font-semibold mb-2">Opportunity Impact Analysis</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  If you decreased Senior Debt rate by 0.5%:
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Volume would increase to:</p>
                    <p className="font-medium flex items-center gap-1">
                      {formatCurrency(projectedMetrics.optimizedVolume)}
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        +47%
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rank would improve to:</p>
                    <p className="font-medium">
                      #{projectedMetrics.optimizedRank} of {totalPartners}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Rest of the existing cards... */}
        {/* Risk Profile Preferences Card */}
        <Card>
          <CardHeader className="bg-muted/30">
            <CardTitle>Risk Profile Preferences</CardTitle>
            <CardDescription>Select which risk profiles you're willing to fund</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="senior-debt">Senior Debt</Label>
                  <p className="text-xs text-muted-foreground">Target: {localProfile.riskProfiles.seniorDebt.targetAllocation}% of portfolio</p>
                </div>
                <Switch
                  id="senior-debt"
                  checked={localProfile.riskProfiles.seniorDebt.enabled}
                  onCheckedChange={(checked) => {
                    setLocalProfile({
                      ...localProfile,
                      riskProfiles: {
                        ...localProfile.riskProfiles,
                        seniorDebt: {
                          ...localProfile.riskProfiles.seniorDebt,
                          enabled: checked,
                        },
                      },
                    });
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="mezzanine">Mezzanine</Label>
                  <p className="text-xs text-muted-foreground">Target: {localProfile.riskProfiles.mezzanine.targetAllocation}% of portfolio</p>
                </div>
                <Switch
                  id="mezzanine"
                  checked={localProfile.riskProfiles.mezzanine.enabled}
                  onCheckedChange={(checked) => {
                    setLocalProfile({
                      ...localProfile,
                      riskProfiles: {
                        ...localProfile.riskProfiles,
                        mezzanine: {
                          ...localProfile.riskProfiles.mezzanine,
                          enabled: checked,
                        },
                      },
                    });
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="equity">Equity</Label>
                  <p className="text-xs text-muted-foreground">Target: {localProfile.riskProfiles.equity.targetAllocation}% of portfolio</p>
                </div>
                <Switch
                  id="equity"
                  checked={localProfile.riskProfiles.equity.enabled}
                  onCheckedChange={(checked) => {
                    setLocalProfile({
                      ...localProfile,
                      riskProfiles: {
                        ...localProfile.riskProfiles,
                        equity: {
                          ...localProfile.riskProfiles.equity,
                          enabled: checked,
                        },
                      },
                    });
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Collateral Type Support Card */}
        <Card>
          <CardHeader className="bg-muted/30">
            <CardTitle>Collateral Type Support</CardTitle>
            <CardDescription>Select which collateral types you accept</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="financial-assets">Financial Assets</Label>
                  <div className="flex gap-2 items-center">
                    <p className="text-xs text-muted-foreground">Advance rate:</p>
                    <Input
                      type="number"
                      value={localProfile.collateralSupport.financialAssets.advanceRate}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setLocalProfile({
                          ...localProfile,
                          collateralSupport: {
                            ...localProfile.collateralSupport,
                            financialAssets: {
                              ...localProfile.collateralSupport.financialAssets,
                              advanceRate: value,
                            },
                          },
                        });
                      }}
                      className="w-16 h-6 text-xs"
                      min={40}
                      max={90}
                    />
                    <span className="text-xs">%</span>
                  </div>
                </div>
                <Switch
                  id="financial-assets"
                  checked={localProfile.collateralSupport.financialAssets.enabled}
                  onCheckedChange={(checked) => {
                    setLocalProfile({
                      ...localProfile,
                      collateralSupport: {
                        ...localProfile.collateralSupport,
                        financialAssets: {
                          ...localProfile.collateralSupport.financialAssets,
                          enabled: checked,
                        },
                      },
                    });
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="real-estate">Real Estate</Label>
                  <div className="flex gap-2 items-center">
                    <p className="text-xs text-muted-foreground">Advance rate:</p>
                    <Input
                      type="number"
                      value={localProfile.collateralSupport.realEstate.advanceRate}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setLocalProfile({
                          ...localProfile,
                          collateralSupport: {
                            ...localProfile.collateralSupport,
                            realEstate: {
                              ...localProfile.collateralSupport.realEstate,
                              advanceRate: value,
                            },
                          },
                        });
                      }}
                      className="w-16 h-6 text-xs"
                      min={40}
                      max={90}
                    />
                    <span className="text-xs">%</span>
                  </div>
                </div>
                <Switch
                  id="real-estate"
                  checked={localProfile.collateralSupport.realEstate.enabled}
                  onCheckedChange={(checked) => {
                    setLocalProfile({
                      ...localProfile,
                      collateralSupport: {
                        ...localProfile.collateralSupport,
                        realEstate: {
                          ...localProfile.collateralSupport.realEstate,
                          enabled: checked,
                        },
                      },
                    });
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="business-assets">Business Assets</Label>
                  <div className="flex gap-2 items-center">
                    <p className="text-xs text-muted-foreground">Advance rate:</p>
                    <Input
                      type="number"
                      value={localProfile.collateralSupport.businessAssets.advanceRate}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setLocalProfile({
                          ...localProfile,
                          collateralSupport: {
                            ...localProfile.collateralSupport,
                            businessAssets: {
                              ...localProfile.collateralSupport.businessAssets,
                              advanceRate: value,
                            },
                          },
                        });
                      }}
                      className="w-16 h-6 text-xs"
                      min={40}
                      max={90}
                    />
                    <span className="text-xs">%</span>
                  </div>
                </div>
                <Switch
                  id="business-assets"
                  checked={localProfile.collateralSupport.businessAssets.enabled}
                  onCheckedChange={(checked) => {
                    setLocalProfile({
                      ...localProfile,
                      collateralSupport: {
                        ...localProfile.collateralSupport,
                        businessAssets: {
                          ...localProfile.collateralSupport.businessAssets,
                          enabled: checked,
                        },
                      },
                    });
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="personal-property">Personal Property</Label>
                  <div className="flex gap-2 items-center">
                    <p className="text-xs text-muted-foreground">Advance rate:</p>
                    <Input
                      type="number"
                      value={localProfile.collateralSupport.personalProperty.advanceRate}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setLocalProfile({
                          ...localProfile,
                          collateralSupport: {
                            ...localProfile.collateralSupport,
                            personalProperty: {
                              ...localProfile.collateralSupport.personalProperty,
                              advanceRate: value,
                            },
                          },
                        });
                      }}
                      className="w-16 h-6 text-xs"
                      min={40}
                      max={90}
                    />
                    <span className="text-xs">%</span>
                  </div>
                </div>
                <Switch
                  id="personal-property"
                  checked={localProfile.collateralSupport.personalProperty.enabled}
                  onCheckedChange={(checked) => {
                    setLocalProfile({
                      ...localProfile,
                      collateralSupport: {
                        ...localProfile.collateralSupport,
                        personalProperty: {
                          ...localProfile.collateralSupport.personalProperty,
                          enabled: checked,
                        },
                      },
                    });
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Market Intelligence Card */}
      <Card className="bg-muted/10">
        <CardHeader>
          <CardTitle>Market Intelligence</CardTitle>
          <CardDescription>Current market trends and opportunities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Market Insights</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mt-1" />
                  <span>Most partners target {marketBenchmarks.seniorDebt}-{(marketBenchmarks.seniorDebt + 0.6).toFixed(1)}% for Senior Debt</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-1" />
                  <span>You're in the top 25% for Mezzanine rates</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500 mt-1" />
                  <span>Consider enabling Business Assets collateral - only 30% of partners accept this</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Achievement Progress</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Badge className="bg-yellow-100 text-yellow-800">Volume Leader</Badge>
                  <p className="text-xs text-muted-foreground">Top 10% monthly volume</p>
                </div>
                <div className="space-y-1">
                  <Badge className="bg-green-100 text-green-800">Quick Responder</Badge>
                  <p className="text-xs text-muted-foreground">Under 2-hour response time</p>
                </div>
                <div className="space-y-1">
                  <Badge className="bg-blue-100 text-blue-800">Portfolio Pro</Badge>
                  <p className="text-xs text-muted-foreground">Balanced risk profiles</p>
                </div>
                <div className="space-y-1">
                  <Badge className="bg-purple-100 text-purple-800">Growth Partner</Badge>
                  <p className="text-xs text-muted-foreground">+20% volume MoM</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={handleReset}>Reset to Defaults</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}