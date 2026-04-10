import { Pipe, PipeTransform } from '@angular/core';
import { GENDER, Gender } from '@shared/types/user';

@Pipe({
  name: 'civility',
})
export class CivilityPipe implements PipeTransform {
  transform(gender: Gender, type: "full" | "short" = "short"): unknown {
    const man: string = type === "full" ? "Monsieur" : "Mr";
    const woman: string = type === "full" ? "Madame" : "Mme";

    return gender === GENDER.WOMAN ? woman : man;
  }
}
