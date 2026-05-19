import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideNav } from "../../components/side-nav/side-nav";
import { DeliveryMenService } from 'app/pages/delivery-men/delivery-men-service';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { OwnersService } from 'app/pages/owners/owners-service';
import { DeliveryPricesService } from 'app/pages/delivery-prices/delivery-prices-service';
import { BrowserNotificationService } from 'core/services/browser-notification-service';
import { NotificationService } from 'app/components/notification/notification-service';
import { NotificationSocketData, SOCKET_EVENT } from '@shared/types/socket';
import { SocketService } from 'core/services/socket-service';

@Component({
  selector: 'app-app-layout',
  imports: [
    RouterOutlet,
    SideNav
],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.css',
})
export class AppLayout implements OnInit {
  // services
  private readonly deliveryMenService: DeliveryMenService = inject(DeliveryMenService);
  private readonly ownersService: OwnersService = inject(OwnersService);
  private readonly deliveryPricesSerivce: DeliveryPricesService = inject(DeliveryPricesService);
  private readonly browserNotificationService: BrowserNotificationService = inject(BrowserNotificationService);
  private readonly notificationService: NotificationService = inject(NotificationService);
  private readonly socketService: SocketService = inject(SocketService);

  // vars
  private readonly unsubscribe$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.loadAllOptions();
    this.browserNotificationService.requestPermission();
    this.loadNotification();

    // show web notification from socket.io
    this.notificationListenner();
  }

  private loadAllOptions(): void {
    combineLatest([
      this.deliveryMenService.getAllAsOptions(),
      this.ownersService.getAllAsOptions(),
      this.deliveryPricesSerivce.getAllCityOptions(),
      this.deliveryPricesSerivce.getAllCooperativeOptions()
    ]).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe();
  }

  private loadNotification(): void {
    this.notificationService.init().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(response => {
      response.forEach((data, i) => {
        setTimeout(() => {
          // show directly notifcation
          this.browserNotificationService.show(data.title, {
            body: data.body,
            tag: data.tag
          });
        }, i * 200);
      });
    });
  }

  private notificationListenner(): void {
    this.socketService.onEvent(SOCKET_EVENT.newNotification, (content: NotificationSocketData[]) => {
      content.forEach((data, i) => {
        setTimeout(() => {
          this.browserNotificationService.show(data.title, {
            body: data.body,
            tag: data.tag
          });
        }, i * 200);
      });
      // mark all notification as pushed
      const ids = content.map(n => n.data.notificationId);
      this.notificationService.markAsPushed(ids).pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe();
    });
  }
}
