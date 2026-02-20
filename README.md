# -arogya
Here is a streamlined project plan for **ArogyaMitra (AroMi AI Agent)**, perfectly tailored for your 5-person team using HTML on Vercel, Firebase for authentication and database, and the Groq API for the AI backend.

By keeping the frontend strictly HTML/JS and utilizing Vercel's serverless features, you get the easiest possible deployment path while keeping your AI keys completely secure.

### 1. The Streamlined Architecture Flow

* **Frontend (HTML/CSS/JS):** Hosted completely free on Vercel. This layer handles the user interface, the chat window, and capturing user biometrics.
* **Authentication & Database (Firebase):** You will use Firebase Auth for a seamless "Sign in with Google" button, and Firebase Firestore (a NoSQL database) to quickly save user profiles, height, weight, and chat history directly from the frontend JavaScript.
* **Backend AI Logic (Vercel Python Serverless Function):** Since placing a Groq API key in plain HTML is a major security risk, you will create a single Python file (e.g., `api/chat.py`) inside your Vercel project. The HTML frontend talks to this Python file, and the Python file securely talks to the Groq API to get AroMi's coaching responses. This is a highly effective and beginner-friendly way to handle backend logic.

---

### 2. Team Roles & Responsibilities (Team of 5)

Divide the work to ensure no one is stepping on each other's toes.

* **Frontend UI Designer (HTML/CSS):** Focuses entirely on the visual layout. Builds the `index.html` (Landing Page) and `dashboard.html` (Chat interface and user settings) ensuring it looks like a premium wellness app.
* **Firebase Integrator (Vanilla JS):** Handles the client-side logic. Implements the Google Sign-in code and writes the JavaScript to save/retrieve user health data from the Firebase Firestore database.
* **Backend AI Developer (Python/Vercel):** Writes the lightweight serverless function (`api/chat.py`). This role involves taking the user's message, securely appending the Groq API key, requesting the response from a Groq model (like Llama 3), and sending it back to the frontend.
* **Prompt Engineer & NLP Specialist:** Focuses on the "brain" of the coach. They will craft the system instructions sent to Groq so that AroMi acts adaptively (e.g., *“You are AroMi. If the user says they are traveling, suggest a 10-minute hotel workout without equipment.”*).
* **Project Manager & QA Tester:** Keeps the GitHub repository organized, connects the main branch to Vercel for automatic deployments, and rigorously tests the app to ensure the database and AI are talking to each other correctly.

---

### 3. Phased Implementation Plan

#### **Phase 1: Setup & Authentication (Days 1-4)**

* **Objective:** Get the core infrastructure live.
* **Tasks:**
* Initialize a GitHub repository with a basic `index.html` file.
* Connect the repository to Vercel for automatic deployments.
* Set up a Firebase project, enable Google Authentication, and add the Firebase initialization script to your HTML.
* *Milestone:* A live Vercel link where users can successfully log in using their Google accounts.



#### **Phase 2: Database & User Profiles (Days 5-9)**

* **Objective:** Collect the data needed to make the AI personalized.
* **Tasks:**
* Build an HTML form for users to input their baseline data (age, fitness goals, injuries, current mood).
* Use Firebase Firestore to save this form data under the user's unique Firebase ID.
* *Milestone:* Users can log in, update their health profile, and the data safely persists in Firestore.



#### **Phase 3: Building the AroMi AI Brain (Days 10-14)**

* **Objective:** Connect the HTML frontend to Groq via Python.
* **Tasks:**
* Create an `api/chat.py` file in the root of your project directory.
* Add your `GROQ_API_KEY` to Vercel's Environment Variables dashboard (never hardcode it in your files).
* Write the Python logic using the `groq` library to accept a message from the frontend, process it through the LLM, and return the coaching advice.
* *Milestone:* The HTML chat window successfully sends a message to the Python function and displays AroMi's response.



#### **Phase 4: The Adaptive Data Loop (Days 15-18)**

* **Objective:** Make the AI context-aware.
* **Tasks:**
* Modify the frontend JavaScript so that when a user sends a chat message, it also pulls their health profile from Firestore and sends it to the Python function as background context.
* Refine the AI prompts so it provides the "Adaptive Health Coaching" you promised in your business challenge.
* *Milestone:* If a user with "bad knees" listed in their database profile asks for a workout, AroMi automatically recommends low-impact exercises.



#### **Phase 5: Polish and Pitch Preparation (Days 19-21)**

* **Objective:** Finalize the product for the business challenge.
* **Tasks:**
* Clean up the CSS to ensure the app looks great on mobile devices.
* Test edge cases (e.g., what happens if the Groq API takes too long to respond?).
* Record a demo video highlighting the "Novelty/Uniqueness" of the adaptive NLP features.



Would you like me to draft the exact Python code you'll need for that `api/chat.py` Vercel serverless function to get your backend started?
