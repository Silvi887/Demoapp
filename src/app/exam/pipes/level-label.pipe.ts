import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'levelLabel', standalone: true })
export class LevelLabelPipe implements PipeTransform {
  transform(level: string): string {
    return ({ Beginner: 'Начинаещ', Intermediate: 'Средно ниво', Advanced: 'Напреднал' } as Record<string, string>)[level] ?? level;
  }
}
