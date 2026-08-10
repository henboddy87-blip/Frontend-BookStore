# React Vite Tailwind Book Store

A modern, responsive, and fully-featured frontend application for a book store. Built with React, Vite, and Tailwind CSS.

## 🚀 Features

- **Home Page**: Engaging Hero section, Featured Books, curated Categories, and promotional banners.
- **Shop & Genre Exploration**: Navigate books by categories, genres (Fiction, Non-fiction, Khmer Literature, etc.), and curated lists (New Arrivals, Bestsellers, Award Winners).
- **Book Details**: Comprehensive book information and preview.
- **Shopping Cart & Checkout**: Seamless cart management and a complete checkout flow.
- **User Authentication**: Integrated login/signup modal.
- **User Profile & Wishlist**: Manage personal details, order history, and save favorite books.
- **Help & Legal Pages**: Complete set of static pages including FAQ, Shipping Info, Returns, Privacy Policy, and more.
- **Responsive Design**: Mobile-friendly interfaces built with Tailwind CSS.
- **Internationalization Ready**: Base structure for translations included.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Language**: TypeScript

## 📂 Project Structure

- `src/components/` - Reusable UI components (Navbar, Footer, BookCard, Cart, Checkout, etc.)
- `src/pages/` - Application routes and page layouts (Home, Profile, Shop, Genre, Help, Legal).
- `src/context/` - React Context for global state management (`StoreContext`).
- `src/data/` - Mock data for books, categories, and translation dictionaries.
- `src/hooks/` - Custom React hooks.
- `src/types/` - TypeScript interface definitions.
- `src/utils/` - Helper functions and utilities.

## ⚙️ Getting Started

### Prerequisites
Make sure you have Node.js (version 20.x recommended) installed.

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or another port provided by Vite).

### Building for Production

To build the app for production, run:
```bash
npm run build
```
The optimized production build will be output to the `dist` folder.

## 📜 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run preview`: Previews the production build locally.
