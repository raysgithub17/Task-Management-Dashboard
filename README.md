# Task Management Dashboard

A React + TypeScript task board with create / edit / delete, filters, list & card views, dark & light theme, and **localStorage** persistence.

## Stack

- [Vite](https://vite.dev/), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`)

## Run locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

On Windows PowerShell, if `npm` scripts are blocked, use `npm.cmd` (e.g. `npm.cmd run dev`).

## Features

- Task fields: title, description, priority (low / medium / high), due date, completed state
- Search (title & description), filter by status and priority
- List and card layout toggle
- Stats: total, pending, completed
- Data stored in the browser (`localStorage`)

## Connect to GitHub (first time)

From this project folder, with [Git](https://git-scm.com/) installed:

```bash
git init
git add -A
git commit -m "Task Management Dashboard: React, TypeScript, Tailwind, Vite"
git branch -M main
git remote add origin https://github.com/raysgithub17/Task-Management-Dashboard.git
```

If the remote already has commits (e.g. an initial README on GitHub), merge histories then push:

```bash
git pull origin main --allow-unrelated-histories
# resolve any merge conflicts if prompted, then:
git push -u origin main
```

If the remote is empty and you want a simple first push:

```bash
git push -u origin main
```

Sign in to GitHub when prompted (HTTPS) or use SSH if you prefer (`git@github.com:raysgithub17/Task-Management-Dashboard.git`).

## License

MIT
