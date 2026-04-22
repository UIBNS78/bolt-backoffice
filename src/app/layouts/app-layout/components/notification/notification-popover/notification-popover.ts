import { Component, computed, inject, OnDestroy, OnInit, Signal, signal, ViewChild, WritableSignal } from '@angular/core';
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
  protected selected: WritableSignal<number> = signal(1);
  protected loading: WritableSignal<boolean> = signal(false);
  protected hasNewNotification: WritableSignal<boolean> = signal(false);
  private _data: WritableSignal<Notification[]> = signal([]);
  protected filtredData: Signal<Notification[]> = computed(() => {
    const data = this._data();
    if (this.selected() === 2) {
      return data.filter(notification => !notification.isRead);
    } else {
      return data;
    }
  });

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
    this.loading.set(true);
    this.loadData();
  }
  
  handleMarkAllAsRead(): void {
    this.notificationService.markAllAsRead().pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(() => this.loadData());
  }

  handleOnClick(notification: Notification): void {
    this.notificationService.markAsRead(notification.id).pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(() => this.loadData());
  }

  private loadData(): void {
    this.notificationService.getAll({ 
      startDate: format(new Date(), "yyyy-MM-dd"), 
      endDate: format(new Date(), "yyyy-MM-dd") 
    }).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.loading.set(false))
    ).subscribe(response => {
      this._data.set(response);
    });
  }
}
