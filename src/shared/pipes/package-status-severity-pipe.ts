import { Pipe, PipeTransform } from '@angular/core';
import { PackageStatus } from '@shared/types/package';

@Pipe({
  name: 'packageStatusSeverity',
})
export class PackageStatusSeverityPipe implements PipeTransform {
  transform(value: PackageStatus): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    switch(value) {
      case 1:
        return "info";

      case 2:
        return "success";

      case 3:
        return "warn";

      case 4:
        return "danger";

      default:
        return "secondary";

    }
  }
}
