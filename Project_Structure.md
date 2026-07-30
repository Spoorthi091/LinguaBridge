# Project Structure — Language Translation Tool

```
Language-Translation-Tool/
│
├── frontend/                          # Static client-side application
│   ├── index.html                     # Page markup and layout
│   ├── style.css                      # Theming, layout, responsiveness, animations
│   ├── script.js                      # UI logic + calls to the backend API
│   └── assets/                        # Reserved for images/icons (currently empty)
│
├── backend/                           # Node.js/Express REST API
│   ├── server.js                      # App entry point: middleware, routes, error handling
│   ├── package.json                   # Backend dependencies and scripts
│   ├── .env.example                   # Template for required environment variables
│   ├── routes/
│   │   └── translate.js               # Defines POST /translate
│   ├── controllers/
│   │   └── translateController.js     # Validates requests, shapes responses
│   └── services/
│       └── apiService.js              # Talks to the LibreTranslate API
│
├── docs/                              # Written project documentation
│   ├── SystemArchitecture.md          # Frontend/backend/API architecture explained
│   ├── API_Documentation.md           # Endpoint reference, request/response formats
│   ├── Project_Report.md              # Internship-style project report
│   └── Deployment_Guide.md            # Local run, GitHub upload, deployment steps
│
├── diagrams/                          # Visual architecture diagrams (PNG, rendered from Mermaid)
│   ├── SystemArchitecture.png
│   ├── Flowchart.png
│   ├── DataFlowDiagram.png
│   ├── UseCaseDiagram.png
│   └── SequenceDiagram.png
│
├── README.md                          # Main project overview and quick start
├── LICENSE                            # MIT License
├── .gitignore                         # Files/folders excluded from git
└── Project_Structure.md               # This file
```

## Folder Responsibilities

| Folder | Responsibility |
|---|---|
| `frontend/` | Everything the user sees and interacts with directly in the browser. No build tools or frameworks — pure HTML/CSS/JS. |
| `backend/` | The REST API layer. Receives translation requests from the frontend, validates them, and forwards them to LibreTranslate. |
| `docs/` | Human-readable documentation explaining how the system works, how to use the API, and how to deploy it. |
| `diagrams/` | Visual references (architecture, flow, DFD, use case, sequence) that accompany `docs/SystemArchitecture.md`. |

## Design Rationale

- **`frontend/` and `backend/` are fully decoupled** — each can be deployed independently (e.g. frontend on Netlify, backend on Render), and they communicate only over HTTP via the `POST /translate` contract defined in `docs/API_Documentation.md`.
- **Backend follows the routes → controllers → services pattern**, a standard Express.js convention that keeps request handling, business logic, and external API calls cleanly separated.
- **All documentation lives in `docs/`** rather than being crammed into the README, keeping the root-level README concise while still giving reviewers (and future contributors) a deep-dive path.
