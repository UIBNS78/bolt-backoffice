import { Component, computed, inject, input, InputSignal, OnDestroy, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { DmRewardRatesService } from 'app/pages/delivery-men/services/dm-reward-rates-service';
import { RewardRate } from 'app/pages/delivery-men/types/delivery-men-reward-rate';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { SkeletonModule } from 'primeng/skeleton';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TooltipModule } from 'primeng/tooltip';
import { finalize, Subject, take, takeUntil } from 'rxjs';
import { RewardRatesForm } from '../reward-rates-form/reward-rates-form';

@Component({
  selector: 'app-dm-reward-rates-handler',
  imports: [
    SplitButtonModule,
    ButtonModule,
    TooltipModule,
    SkeletonModule
],
  templateUrl: './dm-reward-rates-handler.html',
  styleUrl: './dm-reward-rates-handler.css',
})
export class DmRewardRatesHandler implements OnInit, OnDestroy {
  // services
  private readonly dmRewardRatesService: DmRewardRatesService = inject(DmRewardRatesService);
  private readonly dialogService: DialogService = inject(DialogService);
  
  // inputs
  isLoading: InputSignal<boolean> = input.required();
  
  // vars
  private readonly unsubscribe$: Subject<void> = new Subject<void>();
  protected isRewardsLoading: WritableSignal<boolean> = signal(false);
  protected data: WritableSignal<RewardRate[]> = signal([]);
  protected currentReward: Signal<RewardRate | null> = computed(() => this.data().find(d => d.active) ?? null);
  protected rewardActions: Signal<MenuItem[] | undefined> = computed(() => {    
    if (this.data().length === 0) return undefined;

    const items: MenuItem[] = this.data().map(d => ({
      label: `${d.reward.toLocaleString('fr-FR')} Ar`,
      icon: !!d.active ? 'pi pi-check' : 'pi pi-star',
      iconClass: !!d.active ? "text-green-500!" : "",
      labelClass: !!d.active ? "text-green-500" : "",
      disabled: !!d.active,
      items: !d.active ? [
        {
          label: "Appliquer",
          icon: "pi pi-check",
          command: () => this.handleApply(d.id)
        },
        {
          label: "Modifier",
          icon: "pi pi-pencil",
          command: () => this.handleOpenForm(d)
        },
        {
          label: "Supprimer",
          icon: "pi pi-trash",
          command: () => this.handleDelete(d.id)
        }
      ] : undefined,
    }));
    
    return [
      {
        label: "Activer une récompense",
        icon: 'pi pi-arrow-right-arrow-left',
        items
      },
      { 
        label: 'Nouvelle récompense', 
        icon: 'pi pi-plus',
        command: () => this.handleOpenForm()
      },
      {
          separator: true
      },
      { 
        label: 'Désactiver', 
        icon: 'pi pi-ban',
        iconClass: "text-red-500!",
        labelClass: "text-red-500",
        disabled: !this.currentReward(),
        command: () => {}
      },
    ];
  });

  ngOnInit(): void {
    this.loadData();
  }
  
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  handleOpenForm(rewardRate: RewardRate | null = null): void {
    const ref = this.dialogService.open(RewardRatesForm, {
      showHeader: false,
      data: {
        rewardRate,
      },
      width: "25rem"
    });

    ref?.onClose.pipe(
      take(1),
      takeUntil(this.unsubscribe$)
    ).subscribe((refresh: boolean) => {
      if (refresh) {
        this.loadData();
      }
    });
  }
  
  private handleApply(id: number): void {}

  private handleDelete(id: number): void {}

  private loadData(): void {
    this.isRewardsLoading.set(true);
    this.dmRewardRatesService.getRewardRates().pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.isRewardsLoading.set(false))
    ).subscribe(response => this.data.set(response));
  }
}
