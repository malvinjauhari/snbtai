# Project Rules for SNBT AI

## Design Consistency
- Use `backdrop-blur-xl bg-white/10 border border-white/20` for glassmorphism.
- Primary color: Indigo-600 (`#5B50D6`).
- Secondary color: Purple-400 (`#a8a2f9`).
- Rounded corners: `rounded-2xl` or `rounded-full`.

## Code Conventions
- Use functional components with hooks.
- Prefix Firestore error handling with `handleFirestoreError`.
- Ensure all LaTeX is escaped correctly in JSON outputs.

## Feature Logic
- **AI Lens:** Same logic as text prompt, but uses OCR results.
- **Bank Soal:** Dynamic slugs for questions.
- **IRT Simulation:** Use weighted scoring based on question difficulty level.
