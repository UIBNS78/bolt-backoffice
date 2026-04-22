import { Component, inject, OnDestroy, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Popover, PopoverModule } from 'primeng/popover';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { AvatarModule } from 'primeng/avatar';
import { Subject } from 'rxjs';
import { NotificationPlaceholder } from '../notification-placeholder/notification-placeholder';
import { SocketService } from 'core/services/socket-service';
import { NotificationSocketData, SOCKET_EVENT } from '@shared/types/socket';
import { BrowserNotificationService } from 'core/services/browser-notification-service';

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
    NotificationPlaceholder
  ],
  templateUrl: './notification-popover.html',
  styleUrl: './notification-popover.css',
})
export class NotificationPopover implements OnInit, OnDestroy {
  // services
  private readonly socketService: SocketService = inject(SocketService);
  private readonly browserNotificationService: BrowserNotificationService = inject(BrowserNotificationService);
  
  // vars
  private readonly unsubscribe$: Subject<void> = new Subject();
  protected selected: number = 1;
  protected loading: WritableSignal<boolean> = signal(false);
  protected hasNewNotification: WritableSignal<boolean> = signal(false);

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

  private loadData(): void {
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
    }, 2000);
  }
  
  handleOpen(event: Event): void {
    this.notificationPopover.toggle(event);
    this.hasNewNotification.set(false);
    this.loadData();
  }
  
  handleMarkAllAsRead(): void {}
}
