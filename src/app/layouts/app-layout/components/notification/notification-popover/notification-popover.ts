import { Component, computed, inject, OnDestroy, OnInit, Signal, signal, viewChild, WritableSignal } from '@angular/core';
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
import { Notification, NOTIFICATION_TYPES } from '@shared/types/notification';
import { BigramPipe } from '@shared/pipes/bigram.pipe';
import { CivilityPipe } from '@shared/pipes/civility-pipe';
import { DurationPipe } from '@shared/pipes/duration-pipe';
import { DatePickerModule } from 'primeng/datepicker';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

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
    DurationPipe,
    DatePickerModule,
    DatePipe
  ],
  templateUrl: './notification-popover.html',
  styleUrl: './notification-popover.css',
})
export class NotificationPopover implements OnInit, OnDestroy {
  // services
  private readonly socketService: SocketService = inject(SocketService);
  private readonly browserNotificationService: BrowserNotificationService = inject(BrowserNotificationService);
  private readonly notificationService: NotificationService = inject(NotificationService);
  private readonly router: Router = inject(Router);
  
  // vars
  private readonly unsubscribe$: Subject<void> = new Subject();
  protected today: Date = new Date();
  protected selectedDate: WritableSignal<Date> = signal(this.today);
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

  notificationPopover = viewChild<Popover>("notificationPopover");
  datepicker = viewChild<Popover>("datepicker");

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
    this.notificationPopover()!.toggle(event);
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
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id).pipe(
        takeUntil(this.unsubscribe$),
      ).subscribe();
    }
    
    switch(notification.type) {
      case NOTIFICATION_TYPES.newDelivery:
      case NOTIFICATION_TYPES.cancelledDelivery: {
        this.router.navigate(
          ['/deliveries/list'], 
          { 
            queryParams: { 
              delivery: notification.targetId
            }
          }
        );
        break;
      }
    }
    this.notificationPopover()!.hide();
  }

  handleSelectDate(date: Date): void {
    this.selectedDate.set(date);
    this.datepicker()!.hide();
    this.loading.set(true);
    this.loadData()
  }

  private loadData(): void {
    this.notificationService.getAll({ 
      startDate: format(this.selectedDate(), "yyyy-MM-dd"), 
      endDate: format(this.selectedDate(), "yyyy-MM-dd") 
    }).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => this.loading.set(false))
    ).subscribe(response => {
      this._data.set(response);
    });
  }
}
