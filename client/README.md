# Metal Archives Web

Front-end React (Vite) para o gateway Django Ninja.

    npm install
    npm run dev          # http://localhost:5173

Por padrão, `/api` é redirecionado para http://localhost:8000 (veja vite.config.js).
Outro endereço: `GATEWAY_URL=http://host:porta npm run dev`.
Em produção, defina `VITE_API_URL` e habilite CORS no Django.

Rotas de login usadas: POST /api/auth/pair e /api/auth/refresh (src/api.js).
