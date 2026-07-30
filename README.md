# 🌐 Language Translation Tool (LinguaBridge)

A full-stack **Language Translation Tool** built with **HTML5, CSS3, JavaScript** on the frontend and **Node.js + Express.js** on the backend, powered by the free and open-source **LibreTranslate** API.

Built as part of the **CodeAlpha AI Internship**.

---

## 📖 Project Overview

LinguaBridge lets users type or paste text, choose a source and target language, and receive an instant translation. Unlike a purely client-side translator, this version uses a proper backend: the frontend never talks to the translation provider directly. Instead, it calls our own Express REST API (`POST /translate`), which validates the request and forwards it to LibreTranslate — keeping API keys off the client and making the translation provider swappable without touching any frontend code.

---

## ✨ Features

### Core
- 🎨 Modern, responsive UI with a gradient theme
- 📝 Text area for source input (500-character limit with live counter)
- 🌍 Source and target language dropdowns (16 languages)
- 🔘 Translate button with input validation
- 📄 Dedicated output panel for the translated text
- ⏳ Loading animation while the request is in progress
- ⚠️ Error handling across the frontend, backend, and API layers
- 📱 Fully responsive — desktop, tablet, and mobile

### Bonus
- 📋 Copy translated text to clipboard
- 🔊 Text-to-Speech playback of the translation
- 🔁 One-click language swap
- 🧹 Clear button to reset input/output
- ⌨️ Press Enter to translate (Shift+Enter for a new line)

---

## 🛠️ Technologies Used

**Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+), Web Speech API, Clipboard API
**Backend:** Node.js, Express.js, Axios, dotenv, CORS
**Translation Provider:** [LibreTranslate](https://libretranslate.com/) (free, open-source, no billing required)
**Fonts / Icons:** Google Fonts (Poppins, Inter), Font Awesome

---

## 📁 Folder Structure

```
Language-Translation-Tool/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── assets/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── routes/translate.js
│   ├── controllers/translateController.js
│   ├── services/apiService.js
│   └── .env.example
│
├── docs/
│   ├── SystemArchitecture.md
│   ├── API_Documentation.md
│   ├── Project_Report.md
│   └── Deployment_Guide.md
│
├── diagrams/
│   ├── SystemArchitecture.png
│   ├── Flowchart.png
│   ├── DataFlowDiagram.png
│   ├── UseCaseDiagram.png
│   └── SequenceDiagram.png
│
├── README.md
├── LICENSE
├── .gitignore
└── Project_Structure.md
```

See [`Project_Structure.md`](./Project_Structure.md) for a detailed breakdown of every folder's responsibility.

---

## 🚀 Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) v16+
- npm

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/Language-Translation-Tool.git
cd Language-Translation-Tool
```

### 2. Set up the backend
```bash
cd backend
npm install
cp .env.example .env
npm start
```
The API will run at `http://localhost:5000`.

### 3. Open the frontend
Open `frontend/index.html` directly in your browser, or serve it locally:
```bash
cd ../frontend
python -m http.server 3000
```
Then visit `http://localhost:3000`.

> Full setup, environment variable details, and deployment steps are in [`docs/Deployment_Guide.md`](./docs/Deployment_Guide.md).

---

## 📸 Screenshots

> _Add screenshots of the running application here before submitting your internship project._

| Desktop View | Mobile View |
|---|---|
| _Add screenshot_ | _Add screenshot_ |

---

## 📚 Documentation

| Document | Description |
|---|---|
| [`docs/SystemArchitecture.md`](./docs/SystemArchitecture.md) | Frontend, backend, API, and full request/response flow |
| [`docs/API_Documentation.md`](./docs/API_Documentation.md) | Endpoint reference, request/response formats, error codes |
| [`docs/Project_Report.md`](./docs/Project_Report.md) | Internship-style project report |
| [`docs/Deployment_Guide.md`](./docs/Deployment_Guide.md) | Local setup, GitHub upload, and deployment instructions |

---

## 🔮 Future Improvements

- 🌐 Auto-detect the source language
- 🎙️ Speech-to-text input
- 📚 Translation history (with local storage or a database)
- 🌙 Dark mode toggle
- 🗂️ Batch/file translation support
- 🔐 Rate limiting and request throttling on the backend
- 🧪 Automated tests (Jest/Supertest for the backend)

---

## 👤 Author

**CodeAlpha AI Internship Project**
Built as a full-stack learning project demonstrating frontend development, REST API design, and third-party API integration.

---

## 📝 License

This project is licensed under the [MIT License](./LICENSE).
