# Book-Reviews FullStack 🗣️

## Introduction 📚

This is a web application that lets you search for books using the Google Books API and organize them into personal lists (read, to read, currently reading). Users can view, sort (by title, date, rating, favorites), and manage their book collections.
You can also add friends, see books read by all members, your friends, or a specific friend.

## Getting Started 🚀

To get started with the project, follow these steps in your terminal:

1. **Clone the Repository**  
   `git clone https://github.com/Aurelia77/books-reviews.git`

2. **Navigate to the Project Directory**  
   `cd books-reviews`

3. **Start the Development Server**  
   `npm run dev`

The application will now be running in development mode.
<br/>
You can access it by navigating to `http://localhost:3000` in your web browser.

## Development Workflow 🛠️

- **Development Mode**: Run `npm run dev` to start the development server.
- **Testing**: Run `npm run test` to execute tests
- **Building for Production**: Run `npm run build` to create an optimized build of the application.

## Tech Stack & Migration

- The project was initially built with Vite, React, Typescript, Tailwind, and Firebase.
- It was later migrated to Next.js (App Router),
  Prisma, PostgreSQL, and Cloudinary for improved
  scalability and performance.

## Tools 🧰

- Vite then NextJS / React / Typescript / Tailwind
  <br/>
- Firebase then Better-Auth, Prisma, Postgresql and Cloudinary
  <br/>
- React-router-dom then Next.js App Router for routing
  <br/>
- React-hook-form
  <br/>
- Shadcn-ui / clsx / Lucide-react
  <br/>
- Vitest then Jest

## Contributing 🤝

If you'd like to contribute, please follow these steps:

1. **Create a New Branch**:  
   Always create a new branch from `develop` to test new features. Use a naming convention that clearly describes the feature or fix you're working on. For example, if you're adding a new calendar for registration feature, you might name your branch `feature/registration-calendar`.

2. **Keep `develop` Up to Date**:  
   Before starting work on a new feature or fix, make sure your local `develop` branch is up to date with the remote repository. You can do this by running:  
   `git checkout develop`  
   `git pull`  
   `npm install`

   2.b **Keep `develop` Up to Date with a branch already created**:  
   `git checkout nameOfYourBranch`  
   `git pull origin develop`  
   `npm install`

3. **Submit a Pull Request**:  
   Once you've made your changes and tested them, submit a pull request to the `develop` branch.

---

🚀 Happy coding!