import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideNav } from "./components/side-nav/side-nav";
import { DeliveryMenService } from 'app/pages/delivery-men/delivery-men-service';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { OwnersService } from 'app/pages/owners/owners-service';
import { DeliveryPricesService } from 'app/pages/delivery-prices/delivery-prices-service';
import { BrowserNotificationService } from 'core/services/browser-notification-service';

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

  // vars
  private readonly unsubscribe$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.loadAllOptions();
    this.browserNotificationService.requestPermission();
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
}
