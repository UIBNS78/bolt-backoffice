import { Pipe, PipeTransform } from '@angular/core';
import { PackageStatus } from '@shared/types/package';

@Pipe({
  name: 'packageStatus',
})
export class PackageStatusPipe implements PipeTransform {
  transform(value: PackageStatus): string {
    switch(value) {
      case 1:
        return "En cours";

      case 2:
        return "Livré";

      case 3:
        return "Reporté";

      case 4:
        return "Annulé";

      default:
        return "Inconnue";
    }
  }
}
