# 🚀 Batch Day Quiz

A real-time, interactive quiz platform built with React and Firebase. This application allows a host to broadcast questions and participants to join and answer them, with live results and a winner revealed for each round.

## ✨ Features

- **Real-time Interaction**: Questions and answers are updated instantly using Firebase Realtime Database.
- **Host & Join Modes**: Separate interfaces for the quiz master and the participants.
- **Live Results**: The host can see vote distribution and the fastest correct answer as it happens.
- **CI/CD Pipeline**: Automated deployments to Firebase Hosting using GitHub Actions.

## 🛠 Tech Stack

- **Frontend**: React (with Create React App)
- **Backend**: Firebase Realtime Database
- **Styling**: Tailwind CSS
- **Deployment**: Firebase Hosting

## ⚙️ Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/batch-day-quiz.git
    cd batch-day-quiz/quiz-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Firebase:**
    - Create a new project on the [Firebase Console](https://console.firebase.google.com/).
    - In your project, create a new Web App.
    - Copy your Firebase configuration keys.
    - Create a file named `.env.local` in the `quiz-app` directory.
    - Add your Firebase keys to the `.env.local` file in the following format:
      ```
      REACT_APP_FIREBASE_API_KEY=your-api-key
      REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
      REACT_APP_FIREBASE_DATABASE_URL=your-database-url
      # ...and so on for all the keys
      ```

4.  **Run the application:**
    ```bash
    npm start
    ```

    The app will be available at [http://localhost:3000](http://localhost:3000).