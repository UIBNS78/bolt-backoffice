import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

@Pipe({
  name: 'duration',
})
export class DurationPipe implements PipeTransform {
  transform(date: Date): string {
    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  }
}
