import { DatePipe } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';
import { AgePipe } from '@shared/pipes/age.pipe';
import { TransportPipe } from '@shared/pipes/transport.pipe';
import { DeliveryMan } from '@shared/types/delivery-men';
import { NgxMaskPipe } from 'ngx-mask';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ImageModule } from 'primeng/image';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-delivery-man-informations',
  imports: [
    ButtonModule,
    DividerModule,
    TooltipModule,
    ImageModule,
    AgePipe,
    TransportPipe,
    NgxMaskPipe,
    DatePipe
  ],
  templateUrl: './delivery-man-informations.html',
  styleUrl: './delivery-man-informations.css',
})
export class DeliveryManInformations {
  deliveryMan: InputSignal<DeliveryMan> = input.required();
}
