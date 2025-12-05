import { ChangeDetectionStrategy, Component, signal, WritableSignal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Pair {
  symbol: string;
  value: number;
}

interface PairCalculation extends Pair {
  pips: WritableSignal<number>;
  valuedPips: WritableSignal<number>;
}

type PartnershipTier = 'Basic' | 'Prospect' | 'Priority';

interface Level {
  name: string;
  multiplier: number;
  redemptionRate: number;
  partnershipRedemption: {
    [key in PartnershipTier]: number;
  };
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class AppComponent {
  
  readonly PAIRS: Pair[] = [
    { symbol: 'NZDUSD', value: 2 },
    { symbol: 'AUDUSD', value: 2 },
    { symbol: 'EURGBP', value: 2 },
    { symbol: 'USDCHF', value: 2 },
    { symbol: 'USDCAD', value: 1.5 },
    { symbol: 'EURUSD', value: 1.5 },
    { symbol: 'GBPUSD', value: 1.5 },
    { symbol: 'NZDJPY', value: 1.5 },
    { symbol: 'CADJPY', value: 1.5 },
    { symbol: 'AUDJPY', value: 1.5 },
    { symbol: 'CHFJPY', value: 1 },
    { symbol: 'EURNZD', value: 1 },
    { symbol: 'USDJPY', value: 1 },
    { symbol: 'EURJPY', value: 1 },
    { symbol: 'GBPJPY', value: 1 },
    { symbol: 'XAUUSD', value: 0.5 },
  ];
  
  readonly LEVELS: Level[] = [
    { name: 'Rookie', multiplier: 0.3, redemptionRate: 0, partnershipRedemption: { Basic: 0, Prospect: 0, Priority: 0 } },
    { name: 'Pro', multiplier: 0.4, redemptionRate: 0, partnershipRedemption: { Basic: 0, Prospect: 0, Priority: 0 } },
    { name: 'Elite', multiplier: 0.5, redemptionRate: 5000, partnershipRedemption: { Basic: 0.2, Prospect: 0.3, Priority: 0 } },
    { name: 'Master (Medal 8-10)', multiplier: 0.7, redemptionRate: 10000, partnershipRedemption: { Basic: 0.3, Prospect: 0.5, Priority: 1.0 } },
    { name: 'Master (Medal 11-12)', multiplier: 1.0, redemptionRate: 10000, partnershipRedemption: { Basic: 0.3, Prospect: 0.5, Priority: 1.0 } },
    { name: 'Legend', multiplier: 1.5, redemptionRate: 20000, partnershipRedemption: { Basic: 0.5, Prospect: 0.75, Priority: 1.0 } },
  ];

  readonly PARTNERSHIP_TIERS: PartnershipTier[] = ['Basic', 'Prospect', 'Priority'];
  readonly UNIQUE_PAIR_VALUES = [...new Set(this.PAIRS.map(p => p.value))].sort((a, b) => b - a);
  
  // Signals for view management
  activeView: WritableSignal<'main' | 'simulation'> = signal('main');
  isMenuOpen = signal(false);

  // Signals for main calculator
  calculations: WritableSignal<PairCalculation[]> = signal(this.createInitialCalculations());
  selectedLevel: WritableSignal<Level> = signal(this.LEVELS[0]);
  selectedPartnershipTier: WritableSignal<PartnershipTier> = signal('Basic');
  totalValuedPips = signal(0);
  tfPoints = signal(0);
  pointsToRedeem = signal(0);

  // Signals for VP -> Pips & Percentage calculator
  targetVp = signal(0);
  losingTrades = signal(0);
  lossPerTradeVp = signal(125);
  selectedVpCalcValue = signal(0.5);
  pipsFromVp = computed(() => this.selectedVpCalcValue() > 0 ? this.targetVp() / this.selectedVpCalcValue() : 0);
  percentageFromVp = computed(() => this.pipsFromVp() / 250);
  remainingVp = computed(() => this.targetVp() - (this.losingTrades() * this.lossPerTradeVp()));

  // Signals for TF Point Deduction Simulation
  lossVpInput = computed(() => -(this.losingTrades() * this.lossPerTradeVp()));
  selectedLossLevel: WritableSignal<Level> = signal(this.LEVELS[0]);
  isDeductionApplied = computed(() => this.lossVpInput() <= -300);
  totalPointDeduction = computed(() => {
    if (!this.isDeductionApplied()) {
      return 0;
    }
    const multiplier = this.selectedLossLevel().multiplier;
    return this.lossVpInput() * multiplier;
  });

  // Signals for Medal Deduction System
  monthlyVpHistory = signal<number[]>([0, 0, 0, 0, 0, 0]);
  currentMedals = signal(10);

  averageMonthlyVp = computed(() => {
    const qualifiedMonths = this.monthlyVpHistory().filter(vp => vp >= 300);
    if (qualifiedMonths.length === 0) {
      return 300;
    }
    const sum = qualifiedMonths.reduce((acc, vp) => acc + vp, 0);
    return sum / qualifiedMonths.length;
  });

  monthlyLossPercentage = computed(() => {
    const avgVp = this.averageMonthlyVp();
    if (avgVp === 0) return 0;
    return (Math.abs(this.lossVpInput()) / avgVp) * 100;
  });

  monthlyMedalChange = computed(() => this.getMonthlyMedalChange(this.monthlyLossPercentage()));

  consecutiveLossVp = computed(() => {
    let consecutiveLoss = 0;
    const history = this.monthlyVpHistory();
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i] < 0) {
        consecutiveLoss += history[i];
      } else {
        break; // Stop at first profitable month
      }
    }
    return consecutiveLoss;
  });

  consecutiveLossPercentage = computed(() => {
    const avgVp = this.averageMonthlyVp();
    if (avgVp === 0) return 0;
    return (Math.abs(this.consecutiveLossVp()) / avgVp) * 100;
  });

  consecutiveMedalChange = computed(() => this.getConsecutiveMedalChange(this.consecutiveLossPercentage()));

  finalMedalChange = computed(() => this.monthlyMedalChange() + this.consecutiveMedalChange());

  finalMedalCount = computed(() => Math.max(0, this.currentMedals() + this.finalMedalChange()));

  // Signals for main calculator partnership logic
  availablePartnershipTiers = computed(() => {
    const level = this.selectedLevel();
    return this.PARTNERSHIP_TIERS.filter(tier => level.partnershipRedemption[tier] > 0);
  });
  redeemablePercentage = computed(() => {
    const level = this.selectedLevel();
    const tier = this.selectedPartnershipTier();
    if (level.partnershipRedemption[tier] > 0) {
      return level.partnershipRedemption[tier];
    }
    return 0;
  });
  redeemablePointsBalance = computed(() => {
    const totalPoints = this.tfPoints();
    const percentage = this.redeemablePercentage();
    return Math.floor(totalPoints * percentage);
  });
  redeemedCashValue = computed(() => {
    const level = this.selectedLevel();
    const points = this.pointsToRedeem();
    const balance = this.redeemablePointsBalance();
    if (level.redemptionRate === 0 || points <= 0 || points > balance || points % 100 !== 0) {
      return 0;
    }
    return points * level.redemptionRate;
  });
  redemptionMessage = computed(() => {
    const level = this.selectedLevel();
    const points = this.pointsToRedeem();
    const balance = this.redeemablePointsBalance();
    if (level.redemptionRate > 0) {
        if (points > 0 && points > balance) {
        return 'Insufficient redeemable TF Point balance.';
      }
      if (points > 0 && points % 100 !== 0) {
        return 'Redemption must be in multiples of 100.';
      }
    }
    return '';
  });

  // --- Methods ---

  setView(view: 'main' | 'simulation'): void {
    this.activeView.set(view);
  }

  toggleMenu(): void {
    this.isMenuOpen.update(v => !v);
  }

  private createInitialCalculations(): PairCalculation[] {
    return this.PAIRS.map(pair => ({
      ...pair,
      pips: signal(0),
      valuedPips: signal(0),
    }));
  }

  private getMonthlyMedalChange(percentage: number): number {
    if (percentage <= 100) return 0;
    if (percentage <= 150) return -1;
    if (percentage <= 200) return -2;
    if (percentage <= 250) return -3;
    if (percentage <= 275) return -4;
    if (percentage <= 300) return -5;
    if (percentage <= 325) return -6;
    return -7;
  }

  private getConsecutiveMedalChange(percentage: number): number {
    if (percentage <= 100) return 0;
    if (percentage <= 300) return -1;
    if (percentage <= 500) return -2;
    if (percentage <= 600) return -3;
    if (percentage <= 650) return -4;
    if (percentage <= 675) return -5;
    if (percentage <= 700) return -6;
    return -7;
  }
  
  // --- Event Handlers ---

  handlePipsInput(event: Event, pairCalc: PairCalculation): void {
    const input = event.target as HTMLInputElement;
    const pips = parseFloat(input.value) || 0;
    pairCalc.pips.set(pips);
    pairCalc.valuedPips.set(pips * pairCalc.value);
  }

  handleLevelChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const selectedLevel = this.LEVELS.find(level => level.name === select.value);
    if (selectedLevel) {
      this.selectedLevel.set(selectedLevel);
      if (selectedLevel.partnershipRedemption[this.selectedPartnershipTier()] === 0) {
        this.selectedPartnershipTier.set('Basic');
      }
    }
  }

  handlePartnershipChange(tier: PartnershipTier): void {
    this.selectedPartnershipTier.set(tier);
  }
  
  handleRedemptionInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.pointsToRedeem.set(Number(input.value) || 0);
  }

  handleTargetVpInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.targetVp.set(Number(input.value) || 0);
  }

  handleLosingTradesInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.losingTrades.set(Number(input.value) || 0);
  }

  handleLossPerTradeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.lossPerTradeVp.set(Number(input.value) || 0);
  }

  handleVpCalcValueChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedVpCalcValue.set(Number(select.value));
  }
  
  handleLossLevelChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const selectedLevel = this.LEVELS.find(level => level.name === select.value);
    if (selectedLevel) {
      this.selectedLossLevel.set(selectedLevel);
    }
  }

  handleVpHistoryInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value) || 0;
    this.monthlyVpHistory.update(history => {
      const newHistory = [...history];
      newHistory[index] = value;
      return newHistory;
    });
  }

  handleCurrentMedalsInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.currentMedals.set(Number(input.value) || 0);
  }

  calculate(): void {
    const totalVP = this.calculations().reduce((acc, curr) => acc + curr.valuedPips(), 0);
    this.totalValuedPips.set(totalVP);
    
    if (totalVP >= 300) {
      const multiplier = this.selectedLevel().multiplier;
      this.tfPoints.set(totalVP * multiplier);
    } else {
      this.tfPoints.set(0);
    }
  }
  
  reset(): void {
    this.calculations.set(this.createInitialCalculations());
    this.totalValuedPips.set(0);
    this.tfPoints.set(0);
    this.selectedLevel.set(this.LEVELS[0]);
    this.pointsToRedeem.set(0);
    this.selectedPartnershipTier.set('Basic');
    this.targetVp.set(0);
    this.losingTrades.set(0);
    this.lossPerTradeVp.set(125);
    this.selectedVpCalcValue.set(0.5);
    this.selectedLossLevel.set(this.LEVELS[0]);
    this.monthlyVpHistory.set([0, 0, 0, 0, 0, 0]);
    this.currentMedals.set(10);
    this.activeView.set('main');
    this.isMenuOpen.set(false);
  }

  formatNumber(num: number, fractions = 1): string {
    return num.toLocaleString('en-US', { minimumFractionDigits: fractions, maximumFractionDigits: fractions });
  }

  formatPercentage(num: number): string {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
}