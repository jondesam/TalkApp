import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgoSeconde',
})
export class TimeAgoSecondePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    const split = value.split(' ', 2);
    if (+split[0] <= 59 && split[1] === 'seconds') {
      return '1 min';
    } else {
      if (split[1] === 'minutes') split[1] = 'min';
      value = split[0] + ' ' + split[1];
      return value;
    }
  }
}
