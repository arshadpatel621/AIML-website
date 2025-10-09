# AIML Department Website

A modern, responsive, single-page website for the Department of Artificial Intelligence & Machine Learning. Built as a static site (HTML/CSS/JS) with smooth animations using GSAP. No build tools necessary.

## Structure
- index.html — main page with all sections
- assets/css/styles.css — styles and layout
- assets/js/main.js — interactivity and animations
- assets/img/ — place your images here

## Preview locally (Windows)
- Option 1: Double-click index.html to open in your browser
- Option 2: Run a quick local server (recommended for best behavior)
  - Python: `py -m http.server 5050` then open http://localhost:5050/
  - Node (if installed): `npx serve` then open the shown URL

## Deployment
- Netlify: Drag-and-drop the folder in the Netlify dashboard, or connect a Git repo
- GitHub Pages: Push to a repo and enable Pages for the main branch

## Customize
- Branding: Update the brand name in the header of index.html
- Colors: Edit CSS variables in assets/css/styles.css (see :root)
- Faculty/Students/Toppers: Replace placeholder cards in index.html with real data and photos (put images into assets/img and update paths)
- Contact: Update address, phone, and email in the Contact section

## Animations
- GSAP + ScrollTrigger via CDN
- Smooth enter animations for sections, counters, and a simple toppers slider

## Next steps
- Provide your department details (name, logo, color palette, real content) and I’ll update the site accordingly.
"# AIML-website" 
