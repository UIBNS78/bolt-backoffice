import { Pipe, PipeTransform } from '@angular/core';
import { PackageStatus } from '@shared/types/package';

@Pipe({
  name: 'packageStatus',
})
export class PackageStatusPipe implements PipeTransform {
  transform(value: PackageStatus, textTransform: "min" | "maj" = "maj"): string {
    switch(value) {
      case 1:
        return (textTransform === "min" ? "e" : "E") +  "n cours";

      case 2:
        return (textTransform === "min" ? "l" : "L") +  "ivré";

      case 3:
        return (textTransform === "min" ? "r" : "R") +  "eporté";

      case 4:
        return (textTransform === "min" ? "a" : "A") +  "nnulé";

      default:
        return "inconnue";

    }
  }
}
