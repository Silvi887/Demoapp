import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- 1. Добавете това горе

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  features: string[];
  isPopular?: boolean;
}

@Component({
  selector: 'app-prices',
  standalone: true,
  imports: [CommonModule], // <-- 2. Добавете CommonModule тук
  templateUrl: './prices.component.html',
  styleUrl: './prices.component.css'
})
export class PricesComponent {
  // 3. Добавете масива с данни тук:
  plans: PricingPlan[] = [
    {
      name: 'Единично посещение',
      price: '15',
      period: 'за тренировка',
      features: [
        'Достъп до 1 Зумба тренировка',
        'Без нужда от абонамент',
        'Професионален инструктор',
        'Включено оборудване'
      ]
    },
    {
      name: 'Месечен абонамент',
      price: '90',
      period: 'за месец',
      isPopular: true,
      features: [
        'Неограничени тренировки',
        'Приоритетно резервиране на място',
        '1 безплатна индивидуална консултация',
        'Достъп до специални събития',
        '15% отстъпка от фирмен мърч'
      ]
    },
    {
      name: 'Карта 10 посещения',
      price: '120',
      period: 'валидна 60 дни',
      features: [
        '10 Зумба тренировки',
        'Гъвкаво посещение',
        'Валидност 2 месеца',
        'Възможност за прехвърляне на приятел'
      ]
    }
  ];
}