import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MealPlan, NutritionGoal, VitaminInfo } from '../models/nutrition.model';

@Component({
  selector: 'app-nutrition-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page">
      <div class="page-head">
        <div>
          <span class="eyebrow">БАЛАНС • ЕНЕРГИЯ • ВИТАМИНИ</span>
          <h1>Хранителен режим</h1>
          <p class="level-intro">
            Избери подходящ режим за поддържане на форма или плавен старт към по-здравословно хранене,
            осигуряващ всички ключови витамини, минерали и макронутриенти.
          </p>
        </div>
      </div>

      <!-- Филтър по цел -->
      <div class="level-tabs">
        <a
          href="javascript:void(0)"
          [class.active]="selectedGoal === 'all'"
          (click)="filterByGoal('all')">
          Всички режими
        </a>
        <a
          href="javascript:void(0)"
          [class.active]="selectedGoal === 'maintain'"
          (click)="filterByGoal('maintain')">
          Поддържане на форма
        </a>
        <a
          href="javascript:void(0)"
          [class.active]="selectedGoal === 'healthy-start'"
          (click)="filterByGoal('healthy-start')">
          Здравословен старт
        </a>
      </div>

      <!-- Основни правила за деня -->
      <div class="info-grid">
        <div>
          <small>Хидратация</small>
          <strong>30–35 мл вода на кг тегло</strong>
        </div>
        <div>
          <small>Баланс на чинията</small>
          <strong>50% зеленчуци • 25% протеин • 25% сложни въглехидрати</strong>
        </div>
        <div>
          <small>Витамини и фибри</small>
          <strong>Минимум 400 г пресни плодове и зеленчуци дневно</strong>
        </div>
      </div>

      <!-- Карти с хранителни режими -->
      <h2 class="section-title">Примерни дневни менюта</h2>
      <div class="cards">
        <article class="workout-card" *ngFor="let plan of filteredPlans">
          <span class="tag">{{ plan.goalLabel }}</span>
          <h2>{{ plan.title }}</h2>
          <p>{{ plan.description }}</p>

          <ul class="card-meta">
            <li>🔥 {{ plan.calories }}</li>
            <li>💪 Протеин: {{ plan.protein }}</li>
          </ul>

          <div class="phase">
            <b>Дневно разпределение:</b>
            <p><strong>Закуска:</strong> {{ plan.meals.breakfast }}</p>
            <p><strong>Обяд:</strong> {{ plan.meals.lunch }}</p>
            <p><strong>Следобедна закуска:</strong> {{ plan.meals.snack }}</p>
            <p><strong>Вечеря:</strong> {{ plan.meals.dinner }}</p>
          </div>

          <footer>
            <span>Витамини: <strong>{{ plan.keyVitamins.join(', ') }}</strong></span>
          </footer>
        </article>
      </div>

      <!-- Секция за необходими витамини и минерали -->
      <h2 class="section-title" style="margin-top: 45px;">Необходими витамини и хранителни вещества</h2>
      <div class="cards">
        <article class="workout-card" *ngFor="let vit of vitamins">
          <span class="tag">{{ vit.code }}</span>
          <h2>{{ vit.name }}</h2>
          <p>{{ vit.benefit }}</p>
          <footer>
            <span>Източници: <strong>{{ vit.sources.join(', ') }}</strong></span>
          </footer>
        </article>
      </div>
    </section>
  `
})
export class NutritionPage implements OnInit {
  selectedGoal: NutritionGoal = 'all';
  filteredPlans: MealPlan[] = [];

  readonly mealPlans: MealPlan[] = [
    {
      id: 'maintain-balance',
      goal: 'maintain',
      goalLabel: 'Поддържане на форма',
      title: 'Балансиран енергиен режим',
      calories: '2000 – 2200 kcal',
      protein: '120 – 140 г',
      description: 'Поддържа стабилна енергия през целия ден, предпазва мускулната маса и предотвратява резки спадове в кръвната захар.',
      meals: {
        breakfast: 'Овесени ядки с кисело мляко, чия, орехи и боровинки',
        lunch: 'Печено пилешко филе, киноа и голяма салата със зехтин и лимон',
        snack: 'Извара или скир с 1 банан и канела',
        dinner: 'Филе от сьомга на фурна със задушени броколи и сладък картоф'
      },
      keyVitamins: ['Витамин D', 'Омега-3', 'Витамини от група B', 'Магнезий']
    },
    {
      id: 'maintain-active',
      goal: 'maintain',
      goalLabel: 'Поддържане на форма',
      title: 'Активен тонус и възстановяване',
      calories: '2200 – 2400 kcal',
      protein: '140 – 160 г',
      description: 'Подходящ за дни с тренировки – осигурява бавни въглехидрати и антиоксиданти за бързо възстановяване.',
      meals: {
        breakfast: '3 яйца (бъркани или поширани), пълнозърнест тост и авокадо',
        lunch: 'Пуешко месо с кафяв ориз, печени чушки и спанак',
        snack: 'Шепа сурови бадеми и 1 зелена ябълка',
        dinner: 'Телешко или тофу на тиган със зеленчуци и хумус'
      },
      keyVitamins: ['Желязо', 'Цинк', 'Витамин E', 'Витамин B12']
    },
    {
      id: 'healthy-start-clean',
      goal: 'healthy-start',
      goalLabel: 'Здравословен старт',
      title: 'Плавен старт без лишения',
      calories: '1750 – 1950 kcal',
      protein: '100 – 120 г',
      description: 'Идеален за изграждане на устойчиви навици – заменя преработените храни с богати на фибри и витамини ястия.',
      meals: {
        breakfast: 'Чия пудинг с растително или кисело мляко, ленено семе и ягоди',
        lunch: 'Крем супа от червена леща и салата с риба тон и царевица',
        snack: 'Моркови и краставици с гуакамоле или 2 парченца черен шоколад (85%)',
        dinner: 'Бяла риба на пара със зелена салата, репички и тиквени семки'
      },
      keyVitamins: ['Витамин C', 'Фолиева киселина', 'Калий', 'Фибри']
    }
  ];

  readonly vitamins: VitaminInfo[] = [
    {
      code: 'Витамин D3',
      name: 'Имунитет, кости и тонус',
      benefit: 'Подпомага усвояването на калция, мускулната функция и доброто настроение.',
      sources: ['Сьомга', 'Яйчен жълтък', 'Обогатени млечни продукти', 'Слънчева светлина']
    },
    {
      code: 'Витамин C',
      name: 'Антиоксидантна защита',
      benefit: 'Укрепва имунната система, подпомага синтеза на колаген и усвояването на желязото.',
      sources: ['Червени чушки', 'Киви', 'Цитруси', 'Броколи', 'Шипки']
    },
    {
      code: 'Витамини B-комплекс',
      name: 'Енергия и нервна система',
      benefit: 'Превръщат храната в енергия и намаляват чувството на умора и отпадналост.',
      sources: ['Пълнозърнести храни', 'Яйца', 'Месо', 'Бобови култури', 'Ядки']
    },
    {
      code: 'Магнезий и Цинк',
      name: 'Възстановяване и сън',
      benefit: 'Регулират мускулните съкращения, качеството на съня и метаболизма.',
      sources: ['Тиквени семки', 'Спанак', 'Бадеми', 'Овесени ядки', 'Черен шоколад']
    },
    {
      code: 'Омега-3 мастни киселини',
      name: 'Сърце, мозък и стави',
      benefit: 'Намаляват възпалителните процеси в тялото и поддържат сърдечно-съдовото здраве.',
      sources: ['Сьомга и скумрия', 'Орехи', 'Ленено семе', 'Чия']
    },
    {
      code: 'Желязо и Калий',
      name: 'Кислород и воден баланс',
      benefit: 'Желязото пренася кислород до клетките, а калият поддържа нормално кръвно налягане.',
      sources: ['Спанак', 'Леща', 'Банани', 'Авокадо', 'Червено месо']
    }
  ];

  ngOnInit(): void {
    this.filteredPlans = this.mealPlans;
  }

  filterByGoal(goal: NutritionGoal): void {
    this.selectedGoal = goal;
    this.filteredPlans = goal === 'all'
      ? this.mealPlans
      : this.mealPlans.filter(plan => plan.goal === goal);
  }
}