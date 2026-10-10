# Master prompt - Task 1: Image Gallery (paste into Google Antigravity)

Build a project called "HorizonTechX_ImageGallery": a responsive image gallery website.

GLOBAL RULES (follow strictly):
- Use ONLY plain HTML, CSS and vanilla JavaScript. No frameworks, no React, no Tailwind, no npm, no build tools, no bundlers, no external JS libraries. The project must run by simply double-clicking index.html (no server needed).
- Files: index.html, css/style.css, js/script.js (plus assets only if stated). Keep code clean, indented, and commented in simple English, like a student wrote it carefully. Use semantic HTML, CSS variables for colors, and a mobile-first responsive layout (works at 360px, 768px, 1280px).
- The wow factor must be built in vanilla CSS/JS: an animated particle background drawn on a <canvas> (about 60-90 softly moving dots joined by faint lines when close; lines/dots react gently to the mouse; pause when the tab is hidden; reduce count on mobile; respect prefers-reduced-motion by disabling it). Use smooth transitions, subtle entrance animations, glassmorphism cards, one consistent accent color, and a dark theme with good contrast. Use Google Fonts via a single <link> only if needed (system font fallback required).
- It must NOT look auto-generated: no generic lorem ipsum, no emoji spam, consistent spacing scale, real-sounding copy, tidy hover/focus states, keyboard accessibility (focus-visible, aria-labels, alt text).
- Do NOT add features beyond the task requirements listed below except the stated bonus. Do not over-engineer.
- Test everything works with no console errors before finishing, then show me the final file tree.

TASK REQUIREMENTS (from the Horizon TechX task sheet - exactly these):
1. HTML/CSS layout for the gallery (clean responsive grid).
2. JavaScript navigation with next and previous buttons, and a lightbox (click an image to open it large in an overlay; close with X button, Esc key, or clicking the backdrop; Left/Right arrow keys and next/prev buttons move between images; show "3 / 12" counter and the image caption).
3. Hover effects on gallery items (zoom, overlay with title/category).
4. Smooth transitions (fade/scale when opening lightbox and when switching images; filtered items animate in/out).
5. Responsive design (4 columns desktop, 2 tablet, 1-2 mobile; lightbox works on touch - add swipe left/right).
BONUS (include): category filter buttons (All, Nature, City, Architecture, Animals, for example) that filter the grid with animation.

CONTENT:
- 12 images from picsum.photos. Use fixed ids so they never change, e.g. https://picsum.photos/id/1015/800/600 for thumbnails and https://picsum.photos/id/1015/1600/1000 for the lightbox. Pick ids: 1015, 1018, 1020, 1024, 1035, 1039, 1043, 1050, 1062, 1074, 1080, 1084 (replace any that fail to load). Assign each a category, title and one-line caption in a JS array (data-driven; the grid is rendered from this array). Add loading="lazy" and width/height to avoid layout jump.
- Page structure: sticky glass header with title "Frames" (or similar short name), a small hero line, filter bar, gallery grid, simple footer with "Built for Horizon TechX Internship".

DELIVERABLES: the code files, plus the README.md and .gitignore I already placed in the folder (do not delete them).
