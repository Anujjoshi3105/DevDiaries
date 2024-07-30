# Dev Diaries

A comprehensive blog platform dedicated to developers of all levels, from beginners to seasoned professionals. It serves as a digital journal where developers can share their experiences, insights, and technical expertise. The site aims to foster a community of learning, collaboration, and innovation within the tech industry.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Prisma Setup](#prisma-setup)
- [Running the Project](#running-the-project)
- [Styling](#styling)
  - [Setting up Tailwind CSS](#setting-up-tailwind-css)
  - [Using Shadcn](#using-shadcn)
- [Deploying](#deploying)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Dev Diaries is a platform where developers can share their experiences, insights, and technical expertise. It aims to create a community of learning, collaboration, and innovation within the tech industry.

### USER PROFILE
![user profile](public/profile.png)
### SEARCH PAGE
![seach page](public/search.png)
### USER DASHBOARD
![user dashboard](public/dashboard.png)
### BLOG PAGE
![blog](public/blog.png)
### ER MODEL
![er model](public/ermodel.png)

## Features

- User authentication and authorization
- Create, read, update, and delete blog posts
- Comment on blog posts
- Like and share blog posts
- Profile management
- Responsive design

## Tech Stack

- **Frontend**: Next.js, React, Shadcn, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Storage**: Firebase (for profile pictures)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dev-diaries.git
   cd dev-diaries
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the root directory and add the following environment variables:

```env
DATABASE_URL="your-postgresql-connection-string"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_JWT_SECRET="your-nextauth-jwt-secret"
AUTH_SECRET="your-auth-secret"

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCBWor4BL_DJ18Nczgq5kv3FrEfC_I4qzw
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=devdiaries-1.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=devdiaries-1
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=devdiaries-1.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=203695428320
NEXT_PUBLIC_FIREBASE_APP_ID=1:203695

RESEND_API_KEY="your-resend-api-key"

MAIL_USER="your-email@example.com"
MAIL_PASS="your-email-password"
```

## Database Setup

1. Make sure PostgreSQL is installed and running.
2. Create a new PostgreSQL database.

## Prisma Setup

1. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```

2. Migrate the database:
   ```bash
   npx prisma migrate dev --name init
   ```

## Running the Project

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Styling

### Setting up Tailwind CSS

1. Install Tailwind CSS:
   ```bash
   npm install -D tailwindcss
   npx tailwindcss init
   ```

2. Configure `tailwind.config.js`:
   ```javascript
   module.exports = {
     content: [
       "./pages/**/*.{js,ts,jsx,tsx}",
       "./components/**/*.{js,ts,jsx,tsx}",
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```

3. Include Tailwind in your CSS:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

### Using Shadcn

Shadcn is a design system and component library that integrates seamlessly with Tailwind CSS. It provides a set of customizable and accessible UI components.

Refer to the [Shadcn documentation](https://shadcn.dev/docs) for detailed usage and additional components.

## Deploying

### Vercel

1. Push your code to a GitHub repository.
2. Import the repository to Vercel.
3. Set up the environment variables in the Vercel dashboard.

### Other Platforms

Follow the platform-specific instructions for deploying a Next.js application.

## Contributing

We welcome contributions from the community! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-branch
   ```
3. Make your changes.
4. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
5. Push to the branch:
   ```bash
   git push origin feature-branch
   ```
6. Create a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.