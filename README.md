# Todo List App

A simple and responsive todo list application built with React and Vite.

## Features

- Font customization
- Add, edit, and delete todos
- Mark todos as complete/incomplete
- Filter todos (All, Active, Completed)
- Theme selection (Light/Dark themes)
- Responsive design with Tailwind CSS
- Data persistence in localStorage

## File Structure

```
src/
├── App.jsx                 # Main application component
├── main.jsx               # Application entry point
├── components/
│   ├── Navbar.jsx         # Navigation bar
│   ├── ConfirmationModal.jsx  # Delete confirmation modal
│   ├── layout/
│   │   ├── Container.jsx  # Layout container
│   │   └── Header.jsx     # Header component
│   ├── todos/
│   │   ├── FilterBar.jsx  # Todo filter controls
│   │   ├── TodoForm.jsx   # Add new todo form
│   │   ├── TodoItem.jsx   # Individual todo item
│   │   ├── TodoList.jsx   # Todo list container
│   │   └── TodoGrouping.jsx # Todo grouping logic
│   └── ui/
│       ├── EmptyState.jsx # Empty state component
│       ├── FontSelector.jsx # Font selection component
│       └── ThemeSelector.jsx # Theme selection component
└── assets/                # Static assets
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/shivamkarn1/todolist-v2.git
cd todolist-v2
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Technologies Used

- React 18
- Vite
- Tailwind CSS
- Framer Motion (animations)
- React Icons
- Heroicons
