import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { DeliveryMenService } from 'app/pages/delivery-men/delivery-men-service';
import { PackageReward } from 'app/pages/delivery-men/types/delivery-men-reward';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { finalize, Subject, takeUntil } from 'rxjs';
import { DeliveryManRewardForm } from '../delivery-man-reward-form/delivery-man-reward-form';
import { DatePipe } from '@angular/common';

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

  private loadRewards(): void {
    this.deliveryMenService.getRewards().pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.isLoading.set(false))
    ).subscribe(response => {
      this.rewards.set(response);
    });
  }
}
