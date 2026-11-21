# SNBT AI

Premium EdTech platform for UTBK-SNBT preparation featuring AI-powered question generation, IRT simulation, and a luxury learning experience.

## 🚀 Main Features

### 1. AI-Powered Question Engine
The heart of SNBT AI. Generate unlimited, high-quality practice questions for all SNBT subtests using advanced Gemini AI.
- **Full Subtest Support:** Covers Penalaran Umum (PU), Pengetahuan Kuantitatif (PK), Penalaran Matematika (PM), Pengetahuan dan Pemahaman Umum (PPU), PBM, Literasi Bahasa Indonesia (LBI), and Literasi Bahasa Inggris (LBE).
- **Subtest-Specific Logic:** Strictly enforced question types (e.g., P-Q comparison) and language rules (English questions with Indonesian explanations for LBE).
- **Context-Aware Generation:** Questions are generated based on levels and specific topic prompts.

### 2. Smart Question Board
A sophisticated rendering engine for mathematical and text-heavy questions.
- **LaTeX Support:** Full math expression rendering for complex formulas.
- **Intelligent Explanations:** Step-by-step solutions that are readable, structured, and easy to follow.
- **Mobile Optimized Solver:** Responsive interface designed for focused learning on any device.

### 3. IRT Simulation System
Experience realistic scoring like the actual UTBK.
- **Weighted Scoring:** Uses Item Response Theory (IRT) models to calculate scores based on question difficulty levels.
- **Accurate Benchmarking:** Get a better sense of your actual standing compared to simple percentage-based scores.

### 4. Learning Playlists
Organize your study path like a music app.
- **Explore Playlists:** Discover curated question sets from the community or experts.
- **Custom Creation:** Build your own collections (Bank Soal) via the Playlist Editor.
- **Public & Private Paths:** Keep your collections private or share them with others.

---

## 🛠️ Sub Features

### 📈 Comprehensive Analytics
- **Interactive Dashboard:** Track your daily progress, subtest performance, and total questions solved.
- **Progress Visualization:** Beautiful charts powered by Recharts/D3 to see your growth over time.

### 🧠 Specialized Study Tools (Fitur Ambis)
- **Vocab Master:** Level up your English vocabulary for the Literasi Bahasa Inggris subtest.
- **EYD Mastery:** Sharpen your Indonesian grammar and spelling skills for PBM and LBI.
- **Wishlist:** Save challenging questions to your personal bank for later review.
- **Ambis Battle:** Engage in gamified competitive modes to keep motivation high.

### 🔍 AI Lens
- **OCR Capability:** Upload images of questions from textbooks or other sources to be processed and solved by the AI.

---

## ✨ User Experience & Design

### 💎 Premium Interface
- **Glassmorphism Design:** Immersive "glass" UI with backdrop blurs, subtle borders, and a sophisticated dark theme.
- **Motion & Transitions:** Smooth animations using `framer-motion` for a fluid navigating experience.

### 🔐 Security & Reliability
- **Firebase Authentication:** Secure login and session management.
- **Cloud Persistence:** Your progress, wishlist, and playlists are synced across all devices.
- **Navigation Safety:** Intelligent warnings before leaving active sessions to prevent progress loss.

### 📱 Responsive & Adaptive
- Designed for mobile-first precision while maintaining a desktop-grade experience.
- Fluid layouts that respond to any screen size.

### 💳 Student Card & Level Progression
The **"Kartu Tanda Calon Mahasiswa"** is the central piece of the user profile, acting as a dynamic ID card that evolves as you learn.
- **Dynamic Progression:** Your member level increases as you complete more questions on the platform.
- **Badge Tiers:**
    - **Newbie:** Starting level (0+ questions).
    - **Fighter:** Building momentum (20+ questions).
    - **Ambitious:** Seriously determined (75+ questions).
    - **Scholar:** Deep knowledge base (200+ questions).
    - **Elite:** Top-tier performer (400+ questions).
    - **Platinum:** The pinnacle of SNBT preparation (750+ questions).
- **Visual Rewards:** Each tier unlocks unique card styles, color gradients, and glowing effects that reflect your status in the community.
- **Target Tracking:** Set your dream university and program study, which are proudly displayed on your card.

---

## 💻 Tech Stack
- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, Framer Motion
- **Backend/Storage:** Firebase (Firestore, Auth)
- **AI Engine:** Google Gemini API
- **Mathematics:** KaTeX
- **Charts:** Recharts / D3
