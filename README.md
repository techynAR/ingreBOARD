# ingreBOARD

ingreBOARD is a React-based web application built with [Vite](https://vitejs.dev/) and configured for deployment on [Vercel](https://vercel.com/). It integrates with various external APIs including Google's Generative AI (Gemini), Groq, and OCR services to process and analyze content.

## Prerequisites

Before setting up the project locally, ensure you have the following installed on your system:

- **[Node.js](https://nodejs.org/)**: Version 18.x or newer is recommended.
- **npm** (comes with Node.js) or **yarn** / **pnpm**.
- **Git**

## Local Setup Instructions

Follow these steps to get the development environment running locally:

### 1. Clone the Repository

Clone the project repository to your local machine and navigate into the directory:

```bash
git clone <repository-url>
cd ingreBOARD
```

### 2. Install Dependencies

Install all the required Node modules using npm:

```bash
npm install
```

### 3. Configure Environment Variables

The application relies on several external APIs and requires environment variables to function properly. 

Create a `.env.local` file in the root directory of the project and populate it with the necessary API credentials. 

Use the following template for your `.env.local` file:

```env
# OCR Space
VITE_OCR_SPACE_API_KEY="your_ocr_space_api_key_here"

# Google Generative AI (Gemini)
VITE_GEMINI_API_KEY="your_gemini_api_key_here"
GEMINI_API_KEY="your_gemini_api_key_here"

# Groq
VITE_GROQ_API_KEY="your_groq_api_key_here"
GROQ_API_KEY="your_groq_api_key_here"
```
*(Note: You will need to obtain these API keys from their respective service provider dashboards.)*

### 4. Start the Development Server

To start the Vite development server, run:

```bash
npm run dev
```

This will launch the application locally. By default, it will be accessible at `http://localhost:5173/`. 

## Built-in Scripts

The following scripts are defined in the `package.json` for various development tasks:

- **`npm run dev`**: Starts the Vite development server with Hot Module Replacement (HMR).
- **`npm run build`**: Compiles the TypeScript application and builds the app for production into the `dist` folder.
- **`npm run preview`**: Starts a local Server to preview the production build generated in the `dist` directory.
- **`npm run lint`**: Runs ESLint across the source code to identify and enforce code quality and stylistic patterns.

## Technical Architecture Overview

- **Frontend Core**: React 18
- **Routing**: React Router DOM (`react-router-dom`)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion (`framer-motion`) and Lottie Animations (`react-lottie-player`)
- **AI/ML Integrations**: Gemini API (`@google/genai`), Groq SDK (`groq-sdk`)
- **Computer Vision Utilities**: Barcode/QR Scanning (`html5-qrcode`), Client-side OCR (`tesseract.js`)
- **Deployment Platform**: Vercel (using `@vercel/node` for serverless API endpoints)
