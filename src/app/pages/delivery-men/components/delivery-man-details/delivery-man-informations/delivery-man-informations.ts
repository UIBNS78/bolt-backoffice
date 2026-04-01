import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-delivery-man-informations',
  imports: [
    ButtonModule,
    DividerModule,
    TooltipModule
  ],
  templateUrl: './delivery-man-informations.html',
  styleUrl: './delivery-man-informations.css',
})
export class DeliveryManInformations {}
