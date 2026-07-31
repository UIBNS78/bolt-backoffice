import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { DeliveryMenService } from 'app/pages/delivery-men/delivery-men-service';
import { PackageReward } from 'app/pages/delivery-men/types/delivery-men-reward';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { filter, finalize, mergeMap, Subject, take, takeUntil } from 'rxjs';
import { DeliveryManRewardForm } from '../delivery-man-reward-form/delivery-man-reward-form';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogConfirm } from '@shared/components/dialogs/dialog-confirm/dialog-confirm';

@Component({
  selector: 'app-delivery-man-reward-handler',
  imports: [
    ButtonModule,
    CardModule,
    TagModule,
    TooltipModule,
    SkeletonModule,
    DeliveryManRewardForm,
    DatePipe
  ],
  templateUrl: './delivery-man-reward-handler.html',
  styleUrl: './delivery-man-reward-handler.css',
})
export class DeliveryManRewardHandler implements OnInit, OnDestroy {
  // services
  private readonly deliveryMenService: DeliveryMenService = inject(DeliveryMenService);
  private readonly messageService: MessageService = inject(MessageService);
  private readonly dialogService: DialogService = inject(DialogService);

  // vars
  private readonly unsubscribe$: Subject<void> = new Subject<void>();
  protected openForm: WritableSignal<boolean> = signal(false);
  protected selectedReward: WritableSignal<PackageReward | null> = signal(null);
  protected isLoading: WritableSignal<boolean> = signal(false);
  protected rewards: WritableSignal<PackageReward[]> = signal([]);

  ngOnInit(): void {
    this.isLoading.set(true);
    this.loadRewards();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  openRewardForm(reward: PackageReward | null = null): void {
    this.selectedReward.set(reward);
    this.openForm.set(true);
  }

  handleFormClose(refresh: boolean): void {
    this.openForm.set(false);
    this.selectedReward.set(null);
    if (refresh) {
      this.loadRewards();
    }
  }

  handleActivateReward(reward: PackageReward): void {
    if (reward.active) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: `La récompense est déjà active.`
      });
      return;
    }

    const modalRef: DynamicDialogRef<DialogConfirm> | null = this.dialogService.open(DialogConfirm, {
      inputValues: {
        title: "Activation",
        message: `Voulez-vous vraiment activer cette récompense ? Les livreurs seront informés de ce changement via notification.`,
        icon: "pi pi-gift",
        acceptLabel: `Oui, activer`,
        severity: reward.active ? "danger" : "success"
      },
      showHeader: false,
      modal: true,
      draggable: false,
      resizable: false
    });
    
    modalRef?.onClose.pipe(
      take(1),
      filter(confirmed => confirmed),
      mergeMap(() => this.deliveryMenService.activateReward(reward.id)),
      takeUntil(this.unsubscribe$),
    ).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Succès',
        detail: `La récompense a été ${reward.active ? "activée" : "désactivée"}.`
      });
      this.loadRewards();
    });
  }

  handleDeactivateAll(): void {
    const modalRef: DynamicDialogRef<DialogConfirm> | null = this.dialogService.open(DialogConfirm, {
      inputValues: {
        title: "Désactivation",
        message: `Voulez-vous vraiment désactiver toutes les récompenses ? Elles peuvent être réactivées a tout moment.`,
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
      mergeMap(() => this.deliveryMenService.deactivateRewards()),
      takeUntil(this.unsubscribe$),
    ).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Succès',
        detail: `Les récompenses ont été désactivées.`
      });
      this.loadRewards();
    });
  }

  private loadRewards(): void {
    this.deliveryMenService.getRewards().pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.isLoading.set(false))
    ).subscribe(response => {
      this.rewards.set(response);
    });
  }
}
