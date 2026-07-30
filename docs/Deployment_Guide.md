# Deployment Guide — Language Translation Tool

This guide covers running the project locally, uploading it to GitHub, and deploying it so it's publicly accessible.

---

## 1. Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/) v16 or higher
- npm (comes bundled with Node.js)
- A code editor (VS Code recommended)

### Step 1 — Clone or download the project
```bash
git clone https://github.com/<your-username>/Language-Translation-Tool.git
cd Language-Translation-Tool
```

### Step 2 — Install backend dependencies
```bash
cd backend
npm install
```

### Step 3 — Configure environment variables
```bash
cp .env.example .env
```
Open `.env` and confirm/adjust the values (see Section 2 below).

### Step 4 — Start the backend server
```bash
npm start
```
You should see:
```
LinguaBridge backend running at http://localhost:5000
```

For auto-restart during development, use:
```bash
npm run dev
```
(requires `nodemon`, already listed in `devDependencies`)

### Step 5 — Open the frontend
Open `frontend/index.html` directly in your browser (double-click it), or serve it with a simple local server:
```bash
cd ../frontend
python -m http.server 3000
```
Then visit `http://localhost:3000`.

> **Important:** The frontend's `BACKEND_URL` in `script.js` is set to `http://localhost:5000/translate` by default. Update this if your backend runs on a different port or host.

---

## 2. Environment Variables

All backend configuration lives in `backend/.env` (created from `.env.example`):

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the Express server listens on | `5000` |
| `LIBRETRANSLATE_URL` | Full URL of the LibreTranslate `/translate` endpoint | `https://libretranslate.de/translate` |
| `LIBRETRANSLATE_API_KEY` | API key, only if your chosen instance requires one | *(leave blank if not required)* |
| `CORS_ORIGIN` | Comma-separated list of allowed frontend origins | `http://localhost:3000,http://127.0.0.1:5500` |

**Never commit your real `.env` file.** It's already excluded via `.gitignore`.

---

## 3. Uploading to GitHub

### Step 1 — Initialize git (if not already a repository)
```bash
git init
```

### Step 2 — Add and commit your files
```bash
git add .
git commit -m "Initial commit: Language Translation Tool"
```

### Step 3 — Create a new repository on GitHub
Go to [github.com/new](https://github.com/new), name it `Language-Translation-Tool`, and **do not** initialize it with a README (you already have one).

### Step 4 — Link and push
```bash
git remote add origin https://github.com/<your-username>/Language-Translation-Tool.git
git branch -M main
git push -u origin main
```

---

## 4. Uploading to Antigravity

1. Open Antigravity and create a new project / workspace.
2. Import the project either by connecting your GitHub repository or by uploading the `Language-Translation-Tool/` folder directly.
3. Ensure the folder structure (`frontend/`, `backend/`, `docs/`, `diagrams/`) is preserved exactly as-is during import.
4. If Antigravity asks for an entry point, point it to `backend/server.js` for the backend service and `frontend/index.html` for the static frontend.
5. Add the same environment variables from `.env.example` into Antigravity's environment/secrets configuration for the backend service.

---

## 5. Deployment Steps

### Backend (Node.js/Express)
Deploy the `backend/` folder to any Node.js-friendly host, such as **Render**, **Railway**, or **Cyclic**:

1. Create a new **Web Service** and connect your GitHub repository.
2. Set the **root directory** to `backend`.
3. Set the **build command** to `npm install`.
4. Set the **start command** to `npm start`.
5. Add the environment variables from `.env.example` in the host's dashboard (`PORT` is usually auto-assigned by the platform — you can omit it and let the platform inject it).
6. Deploy. Note the public URL the platform gives you (e.g. `https://lingua-bridge-api.onrender.com`).

### Frontend (Static site)
Deploy the `frontend/` folder to any static hosting platform, such as **GitHub Pages**, **Netlify**, or **Vercel**:

**GitHub Pages:**
1. Go to your repository's **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Select the `main` branch and the `/frontend` folder (or move `frontend/` contents to a `docs/` branch folder if GitHub Pages requires it — check current GitHub Pages settings, as folder options vary).
4. Save, and visit the generated URL.

**Netlify / Vercel:**
1. Import the GitHub repository.
2. Set the **base directory** to `frontend`.
3. No build command is needed (it's static HTML/CSS/JS).
4. Deploy.

### Step — Connect frontend to deployed backend
After deploying the backend, update `BACKEND_URL` in `frontend/script.js` to point to your live backend URL instead of `http://localhost:5000/translate`, then redeploy the frontend.

```javascript
const BACKEND_URL = "https://lingua-bridge-api.onrender.com/translate";
```

Also update `CORS_ORIGIN` in the backend's environment variables to include your deployed frontend's URL.

---

## 6. Post-Deployment Checklist

- [ ] Backend `GET /` returns `{ "status": "ok" }`
- [ ] Frontend loads without console errors
- [ ] A test translation succeeds end-to-end
- [ ] `.env` is **not** committed to GitHub (check with `git status`)
- [ ] `CORS_ORIGIN` includes the deployed frontend's exact URL
