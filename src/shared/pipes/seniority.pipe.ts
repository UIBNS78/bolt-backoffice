import { Pipe, PipeTransform } from '@angular/core';
import { formatDistance, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';

@Pipe({
  name: 'seniority',
  standalone: true
})
export class SeniorityPipe implements PipeTransform {

  transform(value: Date, unity: "full" | "short" | "default" = "default"): string {
    const date: Date = new Date(value);
    if (!isValid(date)) {
      return String("0");
    }
    
    const today: Date = new Date();
    const seniority: string = formatDistance(date, today, { addSuffix: true, locale: fr });
    return seniority;
  }

}
