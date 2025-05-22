import { useState } from 'react';
import { usePartnerPortal } from '@/context/partner-portal-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/common/page-header';

export function PartnerProfile() {
  const { profile, updateProfile } = usePartnerPortal();
  const [localProfile, setLocalProfile] = useState(profile);
  
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
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Partner Profile & Lending Parameters"
        description="Configure your lending parameters to match your risk appetite and portfolio objectives."
      />
      
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
                <div className="flex justify-between">
                  <Label>Senior Debt</Label>
                  <span className="text-sm font-medium">{localProfile.yieldRequirements.seniorDebt.minimum}% APR minimum</span>
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
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Mezzanine</Label>
                  <span className="text-sm font-medium">{localProfile.yieldRequirements.mezzanine.minimum}% APR minimum</span>
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
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Equity</Label>
                  <span className="text-sm font-medium">{localProfile.yieldRequirements.equity.minimum}% IRR minimum</span>
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
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground p-2 bg-muted rounded-md">
              <span>Market Benchmarks:</span>
              <span>Senior 6.2% | Mezz 9.1% | Equity 14.3%</span>
            </div>
          </CardContent>
        </Card>
        
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
      
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={handleReset}>Reset to Defaults</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}