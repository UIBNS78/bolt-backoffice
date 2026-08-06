import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { PluralPipe } from '@shared/pipes/plural.pipe';
import { SkeletonModule } from 'primeng/skeleton';
import { BadgeModule } from 'primeng/badge';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { DmService as DeliveryMenService } from './services/dm-service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { SocketService } from 'core/services/socket-service';
import { SOCKET_EVENT } from '@shared/types/socket';
import { DMCounts } from './types/delivery-men-list';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-delivery-men',
  imports: [
    SkeletonModule,
    BadgeModule,
    TooltipModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgClass,
    PluralPipe
  ],
  templateUrl: './delivery-men.html',
  styleUrl: './delivery-men.css',
})
export class DeliveryMen implements OnInit, OnDestroy {
  // services
  private readonly deliveryMenService: DeliveryMenService = inject(DeliveryMenService);
    private readonly socketService: SocketService = inject(SocketService);
  
  // vars
  private readonly unsubscribe$: Subject<void> = new Subject<void>();
  protected isLoading: WritableSignal<boolean> = signal(false);
  protected data: WritableSignal<DMCounts> = signal({
    online: 0, 
    rewardPackages: 0, 
    total: 0
  });

  ngOnInit(): void {
    this.isLoading.set(true);
    
    this.loadData();
    this.socketListenner();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private loadData(): void {
    this.deliveryMenService.getCounts().pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.isLoading.set(false))
    ).subscribe(response => {
      this.data.set(response);
    });
  }
  
  private socketListenner(): void {
    this.socketService.onEvent(SOCKET_EVENT.userConnectivity, () => this.loadData());
  }
}
