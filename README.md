# 🎧 Melodays

**Proposed Level of Achievement: Apollo 11**

---

## Motivation

These days, we have endless songs at our fingertips — but somehow, finding the right one still feels like a struggle. The one that really gets how we’re feeling, or fits whatever we’re in the middle of doing. Most platforms recommend songs based on what we’ve played before or what’s trending, but that doesn’t always match our mood at the moment.

Sometimes we just want a song that gets us. We want to help users rediscover the joy of stumbling upon the right song at the right time — whether they’re celebrating, coping, focusing, or just existing.

---

## Project Scope

A web platform that helps users discover and reflect on music through mood, activity, and daily experiences.

Melodays is a web-based music discovery and journaling platform that recommends songs based on users' mood or activity, offers daily music suggestions, and introduces interactive features like music fortune-telling and music-based journaling. The goal is to make music discovery more personal, emotional, and fun.

---

## Core Features

- **Mood-based song recommendations** (minimal working version; will be extended in Milestone 2)  
  User selects the current mood (e.g. happy, sad, nostalgic), and the system suggests fitted songs.

- **Activity-based song recommendations** (minimal working version; will be extended in Milestone 2)  
  User specifies an activity (e.g. sleeping, exercising, studying), and the system suggests appropriate music.

- **Daily song recommendations** (planned for Milestone 2)  
  User receives a daily curated song recommendation based on trends and personal listening history.

- **Music fortune telling** (planned for Milestone 3)  
  Inspired by the “Book of Answers”, user asks a random question (e.g. “Will I have a good day?” or “Will I marry my current partner?”), and the system returns a randomly selected song as an answer to that question.

- **Music Diary** (planned for Milestone 3)  
  Users can save or tag songs they’ve listened to along with their current mood or activity. This lets them build a personal archive of emotional moments through music.

- **Mood Tracking Over Time** (planned for Milestone 3)  
  Each journal entry contributes to a mood timeline. Users can view how their emotional states have shifted across days or weeks, providing a reflective view of their musical and emotional journey.

---

## Technical Proof of Concept

Follow these steps to run Melodays locally on your laptop.

### Prerequisites

Please make sure you have the following installed:

- Node.js (LTS version) — includes npm  
- Git

---

## Setup Instructions

### 1. Clone the repository on terminal and navigate to the file

```bash
git clone https://github.com/Sophie-Imy/Orbital25-Melodays.git
cd Orbital25-Melodays
````

---

### 2. Run the backend server on terminal

```bash
cd backend
node server.js
```

You should see in your terminal (listening on port 3000):

```
server is running
```

---

### 3. Run the frontend React app on a new terminal window

```bash
cd frontend
npm install
npm start
```

You should see in your terminal:

```
Would you like to run the app on another port instead?
```

Type:

```
Y
```

Then press Enter. This will open the app at:

```
http://localhost:3001
```

---
