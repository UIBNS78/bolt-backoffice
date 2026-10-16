import { NgClass } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PluralPipe } from '@shared/pipes/plural.pipe';
import { BadgeModule } from 'primeng/badge';
import { SkeletonModule } from 'primeng/skeleton';
import { OwnersService } from './owners-service';
import { PusherService } from 'core/services/pusher-service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { pusherChannel, pusherEvent } from '@shared/constants/common';

@Component({
  selector: 'app-owners',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    SkeletonModule,
    NgClass,
    PluralPipe
],
  templateUrl: './owners.html',
  styleUrl: './owners.css',
})
export class Owners implements OnInit, OnDestroy {
  // services
  private readonly ownersService: OwnersService = inject(OwnersService);
  private readonly pusherService: PusherService = inject(PusherService);

  // vars
  private readonly unsubscribe$: Subject<void> = new Subject<void>();
  protected isLoading = signal<boolean>(false);
  protected onlineCounts = signal<number>(0);

  ngOnInit(): void {
    this.loadData();
    this.pusherListenner();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private loadData(): void {
    this.ownersService.getOnlineCounts().pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.isLoading.set(false))
    ).subscribe(response => {
      this.onlineCounts.set(response.online);
    });
  }
  
  private pusherListenner(): void {
    this.pusherService.listen<void>(pusherChannel.ADMIN, pusherEvent.USER_PRESENCE).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(() => this.loadData());
  }
}
