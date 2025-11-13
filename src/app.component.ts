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
  
  calculations: WritableSignal<PairCalculation[]> = signal(this.createInitialCalculations());
  selectedLevel: WritableSignal<Level> = signal(this.LEVELS[0]);
  selectedPartnershipTier: WritableSignal<PartnershipTier> = signal('Basic');
  totalValuedPips = signal(0);
  tfPoints = signal(0);
  pointsToRedeem = signal(0);

  availablePartnershipTiers = computed(() => {
    const level = this.selectedLevel();
    return this.PARTNERSHIP_TIERS.filter(tier => level.partnershipRedemption[tier] > 0);
  });

  redeemablePercentage = computed(() => {
    const level = this.selectedLevel();
    const tier = this.selectedPartnershipTier();
    // Ensure the tier is valid for the level before getting the percentage
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

  private createInitialCalculations(): PairCalculation[] {
    return this.PAIRS.map(pair => ({
      ...pair,
      pips: signal(0),
      valuedPips: signal(0),
    }));
  }
  
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
      // If current partnership tier is not valid for the new level, reset to 'Basic'.
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
  }

  formatNumber(num: number): string {
    return num.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
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