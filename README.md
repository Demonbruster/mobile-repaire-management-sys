## How to setup
 - Clone the repo
 - setup a `.env.local` file with the following variables
    - `IRON_COOKIE_NAME`
    - `IRON_COOKIE_PASSWORD`
    - `USER`
    - `PASSWORD`
    - `MONGODB_URI`
- Commands
    - Run `yarn` to install all the dependencies
    - Run `yarn dev` to start the development server
    - Run `yarn build` to build the app for production
    - Run `yarn start` to start the production server

## How to use
- All api uri's are prefixed with `/api`

## Folder structure

```
└── src/
    ├── components/
    │   │   # the todo "feature" contains everything related to todos
    │   ├── todos/
    │   │   │   # this is used to export the relevant modules aka the public API (more on that in a bit)
    │   │   ├── index.js
    │   │   ├── create-todo-form/
    │   │   ├── edit-todo-modal/
    │   │   ├── todo-form/
    │   │   └── todo-list/
    │   │       │   # the public API of the component (exports the todo-list component and hook)
    │   │       ├── index.js
    │   │       ├── todo-item.component.js
    │   │       ├── todo-list.component.js
    │   │       ├── todo-list.context.js
    │   │       ├── todo-list.test.js
    │   │       └── use-todo-list.js
    │   ├── projects/
    │   │   ├── index.js
    │   │   ├── create-project-form/
    │   │   └── project-list/
    │   ├── ui/
    │   │   ├── index.js
    │   │   ├── button/
    │   │   ├── card/
    │   │   ├── checkbox/
    │   │   ├── header/
    │   │   ├── footer/
    │   │   ├── modal/
    │   │   └── text-field/
    │   └── users/
    │       ├── index.js
    │       ├── login/
    │       ├── signup/
    │       └── use-auth.js
    └── pages/
        │   # all that's left in the pages folder are simple JS files
        │   # each file represents a page (like Next.js)
        ├── create-project.js
        ├── create-todo.js
        ├── index.js
        ├── login.js
        ├── privacy.js
        ├── project.js
        ├── signup.js
        └── terms.js
```