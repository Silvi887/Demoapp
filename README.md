# FitFlow — Angular SPA

FitFlow е уеб приложение за разглеждане на идеи за тренировки и управление на лична тренировъчна колекция. Изградено е с Angular 19, TypeScript и RxJS.

## Functional Guide

### Purpose
Приложението помага на посетителите да откриват тренировки, а на регистрираните потребители — да създават и управляват собствените си тренировъчни записи.

### Main user flows
1. Посетител отваря началната страница и преминава към каталога.
2. В каталога разглежда записи, заредени асинхронно от външен REST API, и отваря детайлна страница чрез идентификатор в URL.
3. Посетител се регистрира или влиза с имейл и парола.
4. В личната зона създава, редактира и изтрива само своите записи.
5. При изход личната зона става недостъпна; след refresh активната сесия се възстановява от browser storage.

### Core features
- Public home, catalog, workout details, login and registration.
- Private dashboard with Create, Read, Update and Delete.
- Form validation and understandable error messages.
- Route guards for authenticated and guest-only pages.
- Responsive layout and empty/loading/error states.

### How to interact
Use the navigation at the top. Select a catalog item to view its details. Register with a name, valid email and password (at least 6 characters), then use the dashboard to manage personal workouts. Records and demo accounts are stored in local browser storage.

## Technical implementation mapped to exam requirements
- **Public/private structure (20 pts):** public home/catalog/auth; guarded dashboard.
- **Routing (10 pts):** 6 explicit routes plus wildcard; `/catalog/:id` is parameterized.
- **Catalog/details & CRUD (30 pts):** external REST catalog and owner-checked CRUD collection.
- **TypeScript/interfaces (5 pts):** `Workout`, `AppUser`; typed code, no `any`.
- **RxJS (10 pts):** observable HTTP and auth operations, `map`, `catchError`; `BehaviorSubject`.
- **Angular concepts (10 pts):** `OnInit`, Angular services, custom `levelLabel` pipe and built-in `titlecase`.
- **Structure/styling (5 pts):** feature folders and external CSS.
- **Forms/UX (10 pts):** reactive forms, validators, invalid-input feedback.
- **Guards (5 pts):** `authGuard`, `guestGuard`.
- **Error handling (5 pts):** network, invalid input, empty catalog/dashboard.

## Installation and run
Requirements: Node.js (compatible with Angular 19) and npm.

```bash
npm install
npm start
```

Open `http://localhost:4200`. Production build:

```bash
npm run build
```

## Data source and demo limitations
The public catalog reads from JSONPlaceholder (`https://jsonplaceholder.typicode.com/posts`). The exam evaluates the front-end; the user collection and demo authentication are stored in `localStorage` so CRUD can be demonstrated without a configured server. This is a frontend demonstration, not production authentication: passwords are not securely stored and browser storage can be modified. For a production project, connect Firebase or a secured backend and enforce ownership on the server.

## Git submission checklist
- Publish the repository as **public**.
- Make at least **5 meaningful commits** distributed across at least **3 different days**. Do not create artificial or backdated commits; commit genuine development milestones as you work.
- Submit the public repository URL in the course Regular Exam section.
