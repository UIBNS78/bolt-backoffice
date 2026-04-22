import { Component, inject, OnDestroy, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Popover, PopoverModule } from 'primeng/popover';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { AvatarModule } from 'primeng/avatar';
import { finalize, Subject, takeUntil } from 'rxjs';
import { NotificationPlaceholder } from '../notification-placeholder/notification-placeholder';
import { SocketService } from 'core/services/socket-service';
import { NotificationSocketData, SOCKET_EVENT } from '@shared/types/socket';
import { BrowserNotificationService } from 'core/services/browser-notification-service';
import { NotificationService } from '../notification-service';
import { format } from 'date-fns';
import { Notification } from '@shared/types/notification';
import { BigramPipe } from '@shared/pipes/bigram.pipe';
import { CivilityPipe } from '@shared/pipes/civility-pipe';
import { DurationPipe } from '@shared/pipes/duration-pipe';

@Component({
  selector: 'app-notification-popover',
  imports: [
    ButtonModule,
    PopoverModule,
    OverlayBadgeModule,
    SelectButtonModule,
    TooltipModule,
    AvatarModule,
    FormsModule,
    NotificationPlaceholder,
    BigramPipe,
    CivilityPipe,
    DurationPipe
  ],
  templateUrl: './notification-popover.html',
  styleUrl: './notification-popover.css',
})
export class NotificationPopover implements OnInit, OnDestroy {
  // services
  private readonly socketService: SocketService = inject(SocketService);
  private readonly browserNotificationService: BrowserNotificationService = inject(BrowserNotificationService);
  private readonly notificationService: NotificationService = inject(NotificationService);
  
  // vars
  private readonly unsubscribe$: Subject<void> = new Subject();
  protected selected: number = 1;
  protected loading: WritableSignal<boolean> = signal(false);
  protected hasNewNotification: WritableSignal<boolean> = signal(false);
  protected data: WritableSignal<Notification[]> = signal([]);

  @ViewChild("notificationPopover") notificationPopover!: Popover

  ngOnInit(): void {
    this.socketService.onEvent(SOCKET_EVENT.newNotification, ({ title, body }: NotificationSocketData) => {
      this.hasNewNotification.set(true);
      this.browserNotificationService.show(title, { body });
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  
  handleOpen(event: Event): void {
    this.notificationPopover.toggle(event);
    this.hasNewNotification.set(false);
    this.loadData();
  }
  
  handleMarkAllAsRead(): void {}

  private loadData(): void {
    this.loading.set(true);
    this.notificationService.getAll({ 
      startDate: format(new Date(), "yyyy-MM-dd"), 
      endDate: format(new Date(), "yyyy-MM-dd") 
    }).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.loading.set(false))
    ).subscribe(response => {
      this.data.set(response);
    });
  }
}
