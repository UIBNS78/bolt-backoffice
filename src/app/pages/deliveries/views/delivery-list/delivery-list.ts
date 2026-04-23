import { Component, inject, OnInit, Signal, signal, viewChild, WritableSignal } from '@angular/core';
import { DeliveriesCount } from '../../components/delivery/deliveries-count/deliveries-count';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { DeliveriesList } from '../../components/delivery/deliveries-list/deliveries-list';
import { Delivery } from '@shared/types/delivery';
import { DeliveryPackagesList } from '../../components/package/delivery-packages-list/delivery-packages-list';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-delivery-list',
  imports: [
    DeliveriesCount,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TooltipModule,
    FormsModule,
    DeliveriesList,
    DeliveryPackagesList,
    RouterLink
  ],
  templateUrl: './delivery-list.html',
  styleUrl: './delivery-list.css',
})
export class DeliveryList implements OnInit {
  // services
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly messageService: MessageService = inject(MessageService);
  
  // vars
  private readonly deliveryByOwnerChild: Signal<DeliveriesList | undefined> = viewChild(DeliveriesList);
  protected selectedDelivery: WritableSignal<Delivery | null> = signal(null); 

  ngOnInit(): void {
    this.handleAutoSelectDelivery();
  }

  handleOnSelectDelivery(delivery: Delivery | null): void {
    this.selectedDelivery.set(delivery);
  }

  handleReloadDeliveries(): void {
    this.deliveryByOwnerChild()!.loadData();
  }

  private handleAutoSelectDelivery(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params["delivery"]) {
        const deliveryId: number = parseInt(params["delivery"]!, 10);

        // check delivery id
        if (Number.isNaN(deliveryId)) {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'L\'identifiant de livraison fourni est invalide.'
          });

          return;
        }

        this.deliveryByOwnerChild()!.loadByQueryParams(deliveryId);
      }
    });
  }
}
