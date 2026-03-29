# מסלול טיולים אפקה 2026

אפליקציית תכנון מסלולי טיולים עם בינה מלאכותית, מפות אינטראקטיביות ותחזית מזג אוויר.

## ארכיטקטורה

הפרויקט מורכב משני שרתים:

- **auth-server** (Express) — שרת הרשאות: הרשמה, התחברות, JWT
- **client** (Next.js) — האפליקציה הראשית: תכנון מסלולים, היסטוריה, מפות

## טכנולוגיות

- **Frontend:** Next.js 15, React, Tailwind CSS, Leaflet.js
- **Backend:** Express, Next.js API Routes
- **Database:** MongoDB (Mongoose)
- **AI:** Google Gemini API — יצירת מסלולים
- **Weather:** OpenWeatherMap API
- **Images:** Unsplash API
- **Auth:** JWT + bcrypt

## התקנה

### דרישות מקדימות
- Node.js 18+
- MongoDB (רץ מקומית או MongoDB Atlas)

### שלבים

1. **Clone the repository:**
```bash
git clone <repo-url>
cd travel-routes
```

2. **Install dependencies:**
```bash
cd auth-server && npm install
cd ../client && npm install
```

3. **Configure environment variables:**

**auth-server/.env:**
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/travel-auth
ACCESS_SECRET=<your-secret-key>
REFRESH_SECRET=<your-secret-key>
CLIENT_URL=http://localhost:3000
```

**client/.env.local:**
```
AUTH_SERVER_URL=http://localhost:4000
NEXT_PUBLIC_AUTH_SERVER_URL=http://localhost:4000
MONGODB_URI=mongodb://localhost:27017/travel-routes
ACCESS_SECRET=<same-as-auth-server>
GEMINI_API_KEY=<your-gemini-api-key>
OPENWEATHERMAP_API_KEY=<your-openweathermap-api-key>
UNSPLASH_ACCESS_KEY=<your-unsplash-access-key>
```

4. **Run the servers:**

Terminal 1 — Auth server:
```bash
cd auth-server && npm run dev
```

Terminal 2 — Next.js client:
```bash
cd client && npm run dev
```

5. **Open the app:**
Navigate to http://localhost:3000

## תכונות

### תכנון מסלולים
- בחירת מדינה/עיר, סוג טיול (טרק/אופניים), ומשך
- יצירת מסלולים באמצעות AI עם קואורדינטות GPS אמיתיות
- הצגה על מפה אינטראקטיבית (Leaflet)
- תחזית מזג אוויר ל-3 ימים קרובים
- תמונה מאפיינת של היעד
- אישור ושמירה למסד נתונים

### היסטוריית מסלולים
- צפייה במסלולים שנשמרו בעבר
- תחזית מזג אוויר מעודכנת

### הרשאות
- הרשמה והתחברות עם הצפנה (bcrypt + salt)
- JWT עם רענון שקוף למשתמש
- Middleware שמגן על דפים מוגנים

## מבנה הפרויקט

```
travel-routes/
├── auth-server/          # Express auth service
│   └── src/
│       ├── controllers/  # Auth logic
│       ├── models/       # User model
│       ├── routes/       # API routes
│       └── utils/        # JWT, password helpers
├── client/               # Next.js app
│   ├── middleware.ts      # JWT validation
│   └── src/
│       ├── app/          # Pages + API routes
│       ├── components/   # React components
│       ├── hooks/        # Auth context
│       ├── lib/          # Service integrations
│       ├── models/       # Route model
│       └── types/        # TypeScript types
└── README.md
```
