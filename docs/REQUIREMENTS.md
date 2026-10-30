# UserHub — Requirements and Implemented Features

Status legend: **Implemented in source** means code is included; **Verify locally** means run and test it before submission.

| Feature | Description / expected behavior | API endpoint | Status |
|---|---|---|---|
| User registration | Accepts full name, email, and password; validates input; rejects duplicate email. | `POST /api/auth/register` | Implemented in source; verify locally |
| Password hashing | Stores SHA-256 password hashes, never plain-text passwords. | N/A | Implemented in source; verify locally |
| User login | Checks email and password and returns a token plus safe user data. | `POST /api/auth/login` | Implemented in source; verify locally |
| Token authentication | Requires `Authorization: Bearer <token>` for protected endpoints. | Protected endpoints | Implemented in source; verify locally |
| User dashboard | Returns the signed-in user's name, email, role, member date, and total user count. | `GET /api/dashboard` | Implemented in source; verify locally |
| Role authorization | Only ADMIN can access the registered-users endpoint. | `GET /api/dashboard/users` | Implemented in source; verify locally |
| Seed ADMIN user | Creates a default administrator on startup if it does not already exist. | Startup `CommandLineRunner` | Implemented in source; verify locally |
| Admin users page | Displays registered users for ADMIN accounts. | `GET /api/dashboard/users` | Implemented in source; verify locally |
| Server-side logout | Removes the current token from the backend session map. | `POST /api/auth/logout` | Implemented in source; verify locally |
| Edit my profile | Allows an authenticated user to update their full name. | `PUT /api/users/me` | Implemented in source; verify locally |
| Protected frontend routes | Redirects visitors without a token to login and hides admin route from USER accounts. | N/A | Implemented in source; verify locally |
| Responsive dashboard | Provides dashboard, profile, admin users, and logout navigation. | N/A | Implemented in source; verify locally |
| H2 database | Uses Spring Data JPA and an in-memory H2 database. | N/A | Implemented in source; verify locally |
| Exception handling | Returns structured JSON errors for validation, unauthorized, forbidden, and duplicate-email cases. | API-wide | Implemented in source; verify locally |

## Default administrator account

- Email: `admin@userhub.com`
- Password: `Admin@123`
- Role: `ADMIN`

Change this password before any real deployment. This account is intended only for the classroom demonstration.

## Notes

- The H2 database is in-memory (`jdbc:h2:mem:userhubdb`) and resets when the backend restarts.
- The UUID token map is also in memory and is cleared when the backend restarts.
- SHA-256 and in-memory UUID sessions follow the supplied laboratory presentation. They are for learning only; production systems should use BCrypt/Argon2 and a maintained security framework with secure token/session management.
- Verify every feature locally and capture actual screenshots in `docs/screenshots/` before submission.
