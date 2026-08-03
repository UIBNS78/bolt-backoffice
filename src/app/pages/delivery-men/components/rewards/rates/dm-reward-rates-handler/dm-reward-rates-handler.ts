import { Component, computed, inject, input, InputSignal, OnDestroy, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { DmRewardRatesService } from 'app/pages/delivery-men/services/dm-reward-rates-service';
import { RewardRate } from 'app/pages/delivery-men/types/delivery-men-reward-rate';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SkeletonModule } from 'primeng/skeleton';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TooltipModule } from 'primeng/tooltip';
import { filter, finalize, mergeMap, Subject, take, takeUntil } from 'rxjs';
import { RewardRatesForm } from '../reward-rates-form/reward-rates-form';
import { DialogConfirm } from '@shared/components/dialogs/dialog-confirm/dialog-confirm';

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
  private readonly messageService: MessageService = inject(MessageService);
  
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
          iconClass: "text-red-500!",
          labelClass: "text-red-500",
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
        command: () => this.handleDeactivate()
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
  
  private handleApply(id: number): void {
    this.isRewardsLoading.set(true);

    this.dmRewardRatesService.applyRewardRate(id).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.isRewardsLoading.set(false))
    ).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Récompense activée avec succès',
      });
      this.loadData();
    });
  }

  private handleDelete(id: number): void {
    const modalRef: DynamicDialogRef<DialogConfirm> | null = this.dialogService.open(DialogConfirm, {
      inputValues: {
        title: "Suppression",
        message: `Voulez-vous vraiment supprimer cette récompense ? Elle ne peut pas être récupérée.`,
        icon: "pi pi-trash",
        acceptLabel: `Oui, supprimer`,
        severity: "danger"
      },
      showHeader: false,
      modal: true,
      draggable: false,
      resizable: false
    });
        
    modalRef?.onClose.pipe(
      take(1),
      filter(confirmed => confirmed),
      mergeMap(() => {
        this.isRewardsLoading.set(true);
        return this.dmRewardRatesService.deleteRewardRate(id);
      }),
      takeUntil(this.unsubscribe$),
      finalize(() => this.isRewardsLoading.set(false))
    ).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Récompense supprimée avec succès',
      });
      this.loadData();
    });
  }

  private handleDeactivate(): void {
    const current = this.currentReward();
    if (!current) return;

    const modalRef: DynamicDialogRef<DialogConfirm> | null = this.dialogService.open(DialogConfirm, {
      inputValues: {
        title: "Désactivation",
        message: `Voulez-vous vraiment désactiver cette récompense ? Les livreurs ne recevrons plus de récompenses tant qu'une autre ne sera pas activée.`,
        icon: "pi pi-gift",
        acceptLabel: `Oui, désactiver`,
        severity: "danger"
      },
      showHeader: false,
      modal: true,
      draggable: false,
      resizable: false
    });
    
    modalRef?.onClose.pipe(
      take(1),
      filter(confirmed => confirmed),
      mergeMap(() => this.dmRewardRatesService.updateRewardRate(current.id, {...current, active: false})),
      takeUntil(this.unsubscribe$),
    ).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Succès',
        detail: `La récompense a été désactivée.`
      });
      this.loadData();
    });
  }

  private loadData(): void {
    this.isRewardsLoading.set(true);
    this.dmRewardRatesService.getRewardRates().pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.isRewardsLoading.set(false))
    ).subscribe(response => this.data.set(response));
  }
}
