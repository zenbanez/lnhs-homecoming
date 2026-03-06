# LNHS Class of '76 Homecoming Application

A dedicated web application for the Leyte National High School (LNHS) Batch 1976 to coordinate, manage, and celebrate our upcoming Golden Anniversary Homecoming.

## 🌟 Features

*   **Dashboard & Coordination Hub:** Centralized view of event details, countdowns, and quick actions for committee members.
*   **Alumni Tracker (Whereabouts):** Secure database to find, update, and manage contact information for batchmates across the globe.
*   **Event Registration & Ticketing (Gala & Fun Run):** Seamless registration flows for the main Gala night and supplementary events like the Fun Run, complete with ticketing and QR codes (planned).
*   **Finance & Ways and Means:** Transparent tracking of registration fees, section contributions, and special donations.
*   **Memory Album:** A collaborative digital gallery where batchmates can upload, categorize, and share nostalgic photos from high school and past reunions.
*   **Document Management (Secretariat):** A secure archive for the organizing committee to store and organize meeting minutes, official letters, and contracts.
*   **In Memoriam:** A dedicated space to honor and remember batchmates who have passed away.
*   **Merchandise Sales (T-Shirts):** Order management for official reunion merchandise.

## 🛠️ Technology Stack

*   **Frontend Framework:** [React 18](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Backend & Database:** [Firebase](https://firebase.google.com/) (Authentication, Firestore Database, Storage)
*   **Routing:** React Router DOM

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need Node.js and npm (Node Package Manager) installed on your system.

*   [Download Node.js](https://nodejs.org/) (LTS version recommended)

### Installation

1.  **Clone the repository** (if applicable):
    ```bash
    git clone <repository-url>
    cd lnhs-homecoming
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Environment Setup

The application relies on Firebase for backend services. You need to configure your environment variables.

1.  Create a file named `.env.local` in the root directory of the project.
2.  Add your Firebase configuration keys to the `.env.local` file using the following format:

    ```env
    VITE_FIREBASE_API_KEY=your_api_key_here
    VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=lnhs-homecoming
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```
    *Note: The storage bucket is specifically set to `gs://lnhs-homecoming` for this project.*

### Running the Development Server

Start the local development server with Vite:

```bash
npm run dev
```

Open your browser and navigate to the URL provided in the terminal (usually `http://localhost:5173`).

## 📁 Project Structure

```
lnhs-homecoming/
├── public/               # Public assets (vite.svg, etc.)
├── src/
│   ├── assets/           # Images, fonts, and other static assets
│   ├── components/       # Reusable UI components (Header, Footer, Layout, etc.)
│   ├── context/          # React Context providers (AuthContext.tsx)
│   ├── pages/            # Main application pages/views (Dashboard, Gala, MemoryAlbum, etc.)
│   ├── App.tsx           # Main application routing and shell
│   ├── firebase.ts       # Firebase initialization and exports
│   ├── index.css         # Global Tailwind styles
│   └── main.tsx          # Application entry point
├── .env.local            # Local environment variables (NOT tracked in git)
├── index.html            # Main HTML template
├── package.json          # Project dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## 🔒 Security

*   Ensure that your `.env.local` file is never committed to version control. It is already included in the `.gitignore` file by default in Vite projects, but always double-check.
*   Firebase security rules should be configured in the Firebase Console to restrict read/write access based on user authentication status.

---
*Built with ❤️ for the LNHS Class of '76*
