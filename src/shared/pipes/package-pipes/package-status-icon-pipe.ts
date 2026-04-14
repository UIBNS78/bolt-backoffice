import { Pipe, PipeTransform } from '@angular/core';
import { PackageStatus } from '@shared/types/package';

@Pipe({
  name: 'packageStatusIcon',
})
export class PackageStatusIconPipe implements PipeTransform {
  transform(value: PackageStatus): string {
    switch(value) {
      case 1:
        return "pi pi-bullseye";

      case 2:
        return "pi pi-check";

      case 3:
        return "pi pi-refresh";

      case 4:
        return "pi pi-times";

      default:
        return "pi pi-question";
    }
  }
}
