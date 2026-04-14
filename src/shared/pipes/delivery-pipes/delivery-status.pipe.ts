import { Pipe, PipeTransform } from '@angular/core';
import { DeliveryStatus } from '@shared/types/delivery';

@Pipe({
  name: 'deliveryStatus',
  standalone: true
})
export class DeliveryStatusPipe implements PipeTransform {

  transform(value: DeliveryStatus): string {
    switch(value) {
      case 1:
        return "En attente";

      case 2:
        return "Récupération";

      case 3:
        return "Livraison";

      case 4:
        return "Terminé";

      default:
        return value;
    }
  }

}
