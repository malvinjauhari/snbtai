# SNBT AI - Project Documentation

## 1. Overview
SNBT AI is a premium EdTech platform designed for Indonesian students preparing for university entrance exams (SNBT). It features AI-powered question generation, IRT (Item Response Theory) simulations, and localized "Ambis" (Ambitious) study habits integration.

## 2. Aesthetic: Luxury Light
- **Colors:** Deep Slate-950 backgrounds with Glassmorphism overlays. High-contrast white text with subtle glow effects. Indigo (#5B50D6) primary accents and Neon Purple (#a8a2f9) for CTAs.
- **Typography:** Plus Jakarta Sans for UI, JetBrains Mono for technical data.
- **Feel:** Lightweight, floating, minimal, and premium.

## 3. Architecture
- **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons, Framer Motion for animations.
- **Backend:** Express.js (Full-stack setup) to handle AI and backend logic.
- **Database:** Firebase (Auth, Firestore).
- **AI:** Gemini 2.5-Flash (via `@google/genai` on frontend) and Gemini 3-flash for reasoning.
- **OCR:** Tesseract.js for scanning questions.
- **Math:** KaTeX for LaTeX rendering.

## 4. Folder Structure
```
/src
  /components
    /ui        (Atomic components, buttons, cards)
    /shared    (Navbar, Layout, Sidebar)
    /chat      (Bubble, Input, History)
    /exam      (Question card, Nav, Timer)
  /services
    /firebase  (Firebase config and helpers)
    /ai        (Gemini integrations, OCR)
  /hooks       (Custom React hooks)
  /utils      (KaTeX helpers, formatters, IRT logic)
  /types       (TypeScript definitions)
  /store       (State management if needed)
```

## 5. Implementation Roadmap
1. **Phase 1: Basic UI Skeleton & Glassmorphism Theme**
   - Setup Tailwind theme and generic Glass components.
   - Implement Floating Navbar.
2. **Phase 2: Auth & Onboarding Flow**
   - Landing page with Google Login.
   - Onboarding flow with the "Dream Student Card" generator.
3. **Phase 3: The AI Chat (Factory)**
   - Chat interface for AI Lens and text-based generation.
   - Integration with Gemini.
4. **Phase 4: Exam System (Interactive)**
   - Question interface with KaTeX.
   - Saved questions (Wishlist) and Vocab saving.
5. **Phase 5: Dashboard & Simulations**
   - Progress tracking and IRT simulation.
   - Ambis Battle (Multi-user logic).
6. **Phase 6: Final Polish & Full-stack refinement**
   - Server-side logic for dynamic content and slugs.

---
*Created by [AI Identity]*
