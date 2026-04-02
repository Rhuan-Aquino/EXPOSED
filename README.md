# ExposedNet

Projeto full stack de uma rede social simples, desenvolvido para estudo.

A aplicação permite criar conta, fazer login, publicar posts (com texto e imagem), visualizar perfis e gerenciar o próprio conteúdo.

---

## 🧠 O que foi praticado

* Autenticação com JWT
* Upload de imagens com armazenamento em nuvem
* Relacionamento entre usuários e posts
* Controle de permissões (ex: só deletar o próprio post)
* Integração completa entre frontend e backend

---

## ✨ Funcionalidades

### Usuário

* Cadastro e login
* Perfil público por username
* Atualização de bio
* Upload de foto de perfil

---

### Posts

* Criar post com texto
* Adicionar imagem ao post
* Feed com posts de todos usuários
* Visualizar perfil ao clicar no usuário
* Deletar post (somente o dono)

---

## 🛠️ Tecnologias usadas

### Backend

* Node.js
* Express
* TypeScript
* Prisma
* PostgreSQL
* Supabase (armazenamento de imagens)

---

### Frontend

* React *(ou Next.js, ajustar se necessário)*
* Fetch API

---

## 📂 Estrutura

```bash
backend/
  src/
    controllers/
    routes/
    middlewares/
    prisma/
    lib/

frontend/
  src/
    pages/
    components/
    utils/
```

---

## ⚙️ Como rodar

### Backend

```bash
cd backend
npm install
```

Criar `.env`:

```env
DATABASE_URL=
JWT_SECRET=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

Rodar:

```bash
npm run dev
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Criar `.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 📡 Rotas principais

### Auth

* POST /auth/register
* POST /auth/login

---

### Usuário

* GET /user/:username
* PUT /user/me

---

### Posts

* GET /posts
* POST /posts
* DELETE /posts/:postId

---

## ⚠️ Observação

Projeto feito com foco em aprendizado e prática de desenvolvimento full stack.

---

## 👤 Autor

Rhuan de Aquino
