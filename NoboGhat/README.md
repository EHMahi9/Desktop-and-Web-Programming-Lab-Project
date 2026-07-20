# NoboGhat

NoboGhat is a Spring Boot and MySQL application with a static frontend for river-trip discovery, user registration, boat/route/trip management, and capacity-aware booking.

## Local setup

1. Copy `backend/.env.example` to `backend/.env` and enter local MySQL credentials.
2. Start the API from `NoboGhat/backend` with `./mvnw spring-boot:run` (Windows: `mvnw.cmd spring-boot:run`).
3. Serve `NoboGhat/frontend` with a static server on port 5500. The frontend will use `http://localhost:8080` automatically.

### Database upgrade and administrator

If you already created the database before the Google-login update, run `database/migration-v2-auth.sql` **once** in MySQL. New databases are created automatically by JPA.

To create the first administrator, set `ADMIN_PHONE` and `ADMIN_PASSWORD` in `backend/.env`, then start the backend once. Do not expose these values. The admin dashboard is available only to this `ADMIN` account.

See `docs/ARCHITECTURE.md` for the design, `docs/GOOGLE_LOGIN_SETUP.md` for Google setup, and `docs/PRESENTATION_NOTES.md` for a project demonstration script.

## Railway deployment

Set the Railway service root directory to `NoboGhat/backend`. The included `railway.toml` builds the JAR and uses `/actuator/health` as its health check. Configure these Railway variables with the values from your MySQL service:

- `SPRING_DATASOURCE_URL` — JDBC URL, for example `jdbc:mysql://host:3306/database?useSSL=true&serverTimezone=UTC`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `CORS_ALLOWED_ORIGINS` — include your Vercel URL if the API is called directly

Railway supplies `PORT` automatically. Do not upload `.env` or production credentials.

## Vercel deployment

Set the Vercel project root directory to `NoboGhat/frontend`. Set `BACKEND_API_URL` to the public Railway backend URL (for example `https://your-api.up.railway.app`). The Vercel API proxy then forwards browser calls from `/api/*` to Railway, so the deployed frontend has no hard-coded backend URL.

## Verification

Run `mvnw.cmd test` from `NoboGhat/backend`. The frontend requires no package installation; open it through a static server rather than directly from the filesystem.
