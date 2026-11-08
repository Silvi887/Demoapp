import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// 1. Добавяте импорта най-горе във файла:

import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Demoapp';
}
