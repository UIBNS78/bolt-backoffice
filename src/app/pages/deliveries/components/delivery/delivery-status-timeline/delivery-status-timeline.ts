import { DatePipe, NgClass } from '@angular/common';
import { Component, computed, input, InputSignal, Signal } from '@angular/core';
import { DeliveryStatusPipe } from '@shared/pipes/delivery-pipes/delivery-status.pipe';
import { deliveryStatusObj } from '@shared/types/delivery';
import { DeliveryTimeline } from 'app/pages/deliveries/types/delivery-timeline';
import { TimelineModule } from 'primeng/timeline';

@Component({
  selector: 'app-delivery-status-timeline',
  imports: [
    TimelineModule,
    DatePipe,
    NgClass,
    DeliveryStatusPipe
  ],
  templateUrl: './delivery-status-timeline.html',
  styleUrl: './delivery-status-timeline.css',
})
export class DeliveryStatusTimeline {
  dates: InputSignal<{ created: Date, finished: Date | null, recovery: Date | null, delivery: Date | null }> = input.required();
  timelines: Signal<DeliveryTimeline[]> = computed(() => {
    const timelines: DeliveryTimeline[] = [
      { status: deliveryStatusObj.pending, date: this.dates().created, icon: 'pi pi-hourglass' },
      { status: deliveryStatusObj.recovery, date: this.dates().recovery, icon: 'pi pi-cart-arrow-down' },
      { status: deliveryStatusObj.delivery, date: this.dates().delivery, icon: 'pi pi-bolt' },
      { status: deliveryStatusObj.finished, date: this.dates().finished, icon: 'pi pi-check' },
    ];

    return timelines;
  });  
}
