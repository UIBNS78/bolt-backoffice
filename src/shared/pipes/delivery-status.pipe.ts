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
        return "en attente";

      case 2:
        return "récupération";

      case 3:
        return "livraison";

      case 4:
        return "finished";

      default:
        return value;
    }
  }

}
