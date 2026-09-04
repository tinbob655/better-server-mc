# Better Server

The official companion website for the **Better Server** Minecraft community — a place for players to check whether the server is online, view the live world map, read news, vote in polls, submit suggestions, and manage their account.

Built as a full-stack app with a **React + TypeScript** client and a **Spring Boot** backend, sharing a space/planet-themed visual identity (deep-space background, glowing orbit accents, planet-blue and landmass-green palette).

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, React Router, Axios, Sass/SCSS |
| Backend | Spring Boot (Web MVC, Data JPA, Security), Java 25 |
| Auth | JWT (`jjwt`), BCrypt password hashing |
| Database | SQLite (via `sqlite-jdbc` + Hibernate's community SQLite dialect) |
| External API | [mcstatus.io](https://mcstatus.io) for live Minecraft server status |

---

## Features
- **Home page** — landing page introducing the server and linking out to every section.
- **Accounts** — register / log in (JWT-based), persistent session via `localStorage`, change password.
- **Permissions system** — two levels out of the box, `DEFAULT` and `DEV`, modeled as a hierarchy (a `DEV` user automatically satisfies any `DEFAULT`-level check).
- **Admin panel** — visible only to `DEV` users; lists all registered accounts and lets an admin promote/demote other users' permission levels.
- **Live server status** — a small overlay widget (visible site-wide) plus a dedicated status page. Polls `mcstatus.io` every 5 seconds and shows:
    - online/offline state
    - current MOTD
    - player count and the list of online players
    - Minecraft version + protocol number
- **Player profiles & stats** — playtime, join date, achievements/advancements.
- **Leaderboards** — playtime, kills, blocks placed, etc.
- **Discord OAuth login** — let players sign in with Discord instead of (or alongside) a Better Server account, and sync roles/permissions.
- **Notification center** — a bell icon tied to the "subscribe to polls/news", backed by a `notifications` table per user.
- **Route-based navigation** with lazy-loaded pages and a responsive header that adds an "Admin" link only for `DEV` users.

| Page | Behaviour                                                                                                                                                       |
|---|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Map** | Live, real-time view of the server's world — zoomable overview down to individual bases, plus real-time player locations. Gated behind an account for security. |
| **Polls** | Players vote on decisions that affect how the server is run; users can subscribe to notifications for new polls.                                                |
| **News** | Admin-authored posts keeping players up to date with server happenings.                                                                                         |
| **Suggestions** | Players submit ideas for the server; staff review and respond to them.                                                                                          |
| **Wiki** | Player-facing documentation/guide content (rules, how-to-join, builds, etc.).                                                                                   |
---

## Project structure

```
client/                          React + Vite frontend
  src/
    pages/                       One folder per route (home, account, admin, map, news, polls, serverStatus, suggestions, wiki)
    components/                  Shared UI (FancyButton, GenericMarkupSection, PopupWrapper, form controls, header, footer)
    context/                     React context providers (auth, server status)
    functions/                   Small helpers (e.g. parseAxiosError)
    scss/                        Design tokens (_variables.scss) + shared stylesheets
    types/                       Shared TypeScript types (auth, permission, serverStatus)

server/                          Spring Boot backend
  src/main/java/world/betterserver/server/
    config/                      Security config, JWT filter, global exception handler
    controller/                  REST controllers (auth, serverStatus), split into an interface ("Template") + implementation
    model/
      dto/request, dto/response  Request/response records
      entity/user                JPA entities (User, Permission)
    service/                     JwtService, UserDetailsService
  src/main/resources/
    application.properties       Server config (see below)
```

The controllers follow the following pattern: each REST controller implements a `sealed interface ...Template` that owns the `@RequestMapping`/`@GetMapping`/`@PreAuthorize` annotations, while the concrete class holds the actual logic. This keeps routing/security declarations in one readable place, separate from implementation.

---

## Getting started

### Prerequisites

- Node.js 18+ and npm
- Java 25 and Maven
- A Minecraft server address you want to track (for the status feature)

### 1. Backend

```bash
cd server
```

Fill in the blank values in `src/main/resources/application.properties`:

```properties
mcstatus.server.address=play.yourserver.net
jwt.secret=some-long-random-string
```

`jwt.secret` is used to sign JWTs with `Keys.hmacShaKeyFor(...)`, so it needs to be long enough for HMAC-SHA (32+ bytes recommended). `mcstatus.server.address` is the Java-edition server address that gets forwarded to the mcstatus.io API.

Then run it:

```bash
./mvnw spring-boot:run
```

This compiles the project and starts the embedded server (default port `8080`). On first run, Hibernate will create the `users` table in the SQLite file at `src/main/resources/db/betterserver.sqlite` because `spring.jpa.hibernate.ddl-auto=update` is set.

### 2. Frontend

```bash
cd client
npm install
```

Create a `.env` file alongside `vite.config.ts`:

```
VITE_API_BASE_URL=http://localhost:8080/api
```

`axiosInstance.ts` reads this at build/dev time as the base URL for every API call, and automatically attaches `Authorization: Bearer <token>` once a user logs in.

```bash
npm run dev
```

This starts Vite's dev server on port `3000` (configured in `vite.config.ts`), which matches the `client.vite.url` the backend's CORS config expects.

> ⚠️ The Spring Security config only allows CORS requests from whatever `client.vite.url` is set to in `application.properties`. If you change the frontend's dev port, update that property too.

---

## Authentication & permissions model

- Passwords are hashed with **BCrypt** before being stored (`PasswordEncoder` bean in `SecurityConfig`).
- On login, Spring Security's `AuthenticationManager` verifies credentials, then `JwtService` issues a signed JWT (default lifetime: `jwt.expiration-ms=604800000` ms, i.e. 7 days).
- The token is stored in `localStorage` on the client and replayed as a `Bearer` header on every request via an Axios request interceptor.
- `JwtAuthFilter` runs once per request, validates the token, and — if valid — populates Spring Security's `SecurityContext` so `@PreAuthorize` checks work downstream.
- Permissions are a simple ordered enum (`DEFAULT` = 0, `DEV` = 10). `UserDetailsService` grants a user every permission at or below their stored level, so a `DEV` user is automatically treated as `DEFAULT` too — no need to store multiple roles per user.

---

## Contributing

Issues and pull requests are welcome. If you're picking up one of the "scaffolded" pages above, it's worth first sketching the DTOs/entities it'll need on the backend (following the existing `dto/request` + `dto/response` + `entity` split) before wiring up the frontend page.

## License

## Credits

Website by **[Tinbob655](https://tinbob655.github.io/tinbob655/)**, built for the Better Server community.