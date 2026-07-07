# Alphabit-AI

A modern AI chatbot built with the MERN stack — React, Node.js, Express, and MongoDB.

## Project Structure

```
alphabit-ai/
├── client/          # React + Vite frontend
├── server/          # Node.js + Express backend
├── package.json     # Root scripts (concurrently)
└── README.md
```

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, Framer Motion, React Router  
**Backend:** Node.js, Express, MongoDB Atlas, Mongoose, JWT, bcrypt  
**AI:** Google Gemini API

## Getting Started

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Environment variables

**client/.env**
```env
VITE_API_URL=http://localhost:5000/api
```

**server/.env**
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

### 3. Run development servers

```bash
npm run dev
```

- Frontend: http://localhost:5173  
- Backend: http://localhost:5000

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start client + server concurrently |
| `npm run client` | Start frontend only |
| `npm run server` | Start backend only |
| `npm run build` | Build frontend for production |
| `npm start` | Start production server |

## API Routes

### Auth
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login user
- `GET /api/auth/me` — Get current user (protected)

### Chats (protected, ready for integration)
- `GET /api/chats` — List user chats
- `POST /api/chats` — Create chat
- `GET /api/chats/:id` — Get chat by ID
- `PUT /api/chats/:id` — Update chat
- `DELETE /api/chats/:id` — Delete chat

### AI
- `POST /api/chat/ask` — Generate AI response (body: `{ "prompt": "..." }`, returns `{ "reply": "..." }`)

## License

MIT
