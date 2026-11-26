# FitFlow — Angular Project - Functional Guide

## 1.Application Purpose
The goal of the application is to help users explore structured workout routines by difficulty level, learn about balanced nutrition plans, and create and manage their own personal workout programs.

## 2.User Roles
### Guest (Not Authenticated User)
* Can view the Home page
* Can browse the Workout Catalog by difficulty level (`Beginner`, `Intermediate`, `Advanced`)
* Can view full Details of any workout (duration, equipment, warmup, step-by-step exercises, cooldown)
* Can browse and filter Nutrition plans and vitamin guides
* Can register a new account or log in

### Authenticated User
* Has access to all Guest features
* Can access the private Personal Dashboard (`/dashboard`)
* Can create new personal workout records
* Can edit their own workout records
* Can delete their own workout records
* Remains logged in after refreshing the page

 ## 3.Public Features
* **Home Page (`/`):** Presents the purpose of FitFlow and provides quick navigation to the catalog.
* **Catalog Page (`/catalog`):** Displays workout levels along with the total number of available routines per level.
* **Level Catalog Page (`/catalog/level/:level`):** Lists all workouts for the selected difficulty level with category, duration, and exercise count.
* **Workout Details Page (`/catalog/:id`):** Displays comprehensive information for a selected workout, including target goal, required equipment, frequency, exercise sequence, sets, reps, rest intervals, and execution tips.
* **Nutrition Page (`/nutrition`):** Provides daily meal plans filterable by goal (`All`, `Maintain Form`, `Healthy Start`) and information on essential vitamins and minerals.
* **Login Page (`/login`):** Allows existing users to sign in using email and password with validation and error feedback.
* **Registration Page (`/register`):** Allows guests to create a new account using name, email, and password (minimum 6 characters).
* **Not Found Page (`**`):** Handles invalid URLs with a user-friendly 404 message and navigation back to the home page.

## Authenticated User Features
* **Personal Dashboard (`/dashboard`):** Displays all workouts created by the currently logged-in user.
* **Create Workout:** Authenticated users can add new custom workouts (title, description, category, level, duration) with form validation.
* **Edit Own Workouts:** Users can modify only the workouts they have created (`ownerId` check).
* **Delete Own Workouts:** Users can remove their own workouts after confirmation.

 ## 4.Main Application Flow
4.1. User opens the Home page (`/`).
4.2. User navigates to the Catalog page (`/catalog`) and selects a difficulty level (`/catalog/level/:level`).
4.3. User selects a workout card and opens its Details page (`/catalog/:id`) to inspect the exercises.
4.4. User navigates to the Register (`/register`) or Login (`/login`) page and authenticates.
4.5. User is redirected to the private Dashboard (`/dashboard`).
4.6. Authenticated user creates a new workout record, which is saved and displayed both in their Dashboard and in the public Catalog under the corresponding level.
4.7. Authenticated user can edit or delete their own workout records at any time.

## 5.Data Structure
### Workout Object
* `id` — Unique numeric identifier
* `title` — Workout title
* `description` — Short summary of the routine
* `category` — Workout category (e.g., Strength, Cardio, Mobility, Fitness)
* `level` — Difficulty level (`Beginner` | `Intermediate` | `Advanced`)
* `duration` — Duration in minutes
* `ownerId` — Identifier of the user who created the record (for user-created workouts)
* `isLocal` — Flag indicating user-created storage entry
* `overview`, `goal`, `equipment`, `frequency`, `warmup`, `cooldown`, `exercises` — Optional detailed program fields

### User Object (`AppUser`)
* `id` — Unique user identifier (UUID)
* `email` — User email address
* `displayName` — User display name

## 6.Project Architecture
```text
src/app/
├── exam/
│   ├── guards/        # Route protection (authGuard)
│   ├── models/        # TypeScript interfaces (workout, nutrition)
│   ├── pages/         # Routed page components (Home, Catalog, Level, Details, Auth, Dashboard, Nutrition, NotFound)
│   ├── pipes/         # Custom pipes (LevelLabelPipe)
│   └── services/      # Business logic & data services (AuthService, WorkoutService)
├── header/            # Application navigation bar
├── home/              # Additional layout/presentation components
├── about-me/          # Additional informational section
├── prices/            # Pricing plans view
├── schedule/          # Weekly schedule view
├── contacts/          # Contact information view
├── app.routes.ts      # Application routing configuration
└── app.config.ts      # Application providers and HTTP client setup
```

 ## 7.Technologies Used
* **Angular 19** (Standalone Components, Reactive Forms, Angular Router, HttpClient)
* **TypeScript** (Strict typing and interfaces)
* **RxJS** (`Observable`, `BehaviorSubject`, `map`, `catchError`, `shareReplay`)
* **JSON Data Source & Browser LocalStorage** (Asynchronous catalog loading from `public/data/workouts.json` combined with persistent browser storage for user accounts and personal CRUD records)
* **CSS** (Component and global stylesheets)

 ## 8.How to Run the Project
8.1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Fitflow-angular-master
   ```
8.2. Install dependencies:
   ```bash
   npm install
   ```
8.3. Start the application:
   ```bash
   npm start
   ```
   *(or `ng serve`)*
8.4. Open the application in your browser:
   ```text
   http://localhost:4200
   