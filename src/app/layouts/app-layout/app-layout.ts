import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideNav } from "./components/side-nav/side-nav";
import { DeliveryMenService } from 'app/pages/delivery-men/delivery-men-service';
import { combineLatest, Subject, takeUntil } from 'rxjs';

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
  // vars
  private readonly unsubscribe$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.loadAllOptions();
  }

  private loadAllOptions(): void {
    combineLatest([
      this.deliveryMenService.getAllAsOptions()
    ]).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe();
  }
}
