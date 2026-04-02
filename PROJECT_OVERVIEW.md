# Project Overview

This workspace contains a set of small web projects. Each one is summarized below with the main ideas it demonstrates and the features/patterns used so you can reuse them later in a larger combined project.

## Projects

| Project | Brief | Features used |
| --- | --- | --- |
| Cash_Register | Cash register change calculator that determines the correct change or drawer status. | DOM input handling, event listeners, currency math, cent-based precision, conditional branching, array/object data structures, greedy change calculation, status messages. |
| DecimalToBinary | Decimal-to-binary converter with animated recursion visualization. | Recursive function design, async/await, delay animation, DOM updates, step-by-step rendering, input validation, call-stack style display. |
| Dice_Game | Score-based dice game with rounds, rules, and score tracking. | Random number generation, state management, DOM updates, radio/button controls, score history, modal/rules toggle, round tracking. |
| Documentation_Page | Technical documentation layout with responsive navigation. | Fixed sidebar navigation, responsive hamburger menu, section anchors, semantic content structure, mobile-first layout. |
| Forum_Page | Forum leaderboard that loads and renders topic data dynamically. | Fetch API, async data loading, table rendering, category mapping, avatar rendering, relative time formatting, link generation, DOM templating. |
| palindrome_checker | Palindrome checker for user-entered text. | Input validation, string sanitization, reverse comparison, event handling, conditional messaging, class toggling for results. |
| platformer_game | Browser platformer with levels, enemies, coins, checkpoints, and audio. | Canvas rendering, object-oriented JavaScript, game loop, collision detection, level loading from JSON, fallback data loading, HUD/state management, particles, sound effects, pause/start/restart flow, keyboard and mobile controls. |
| Portfolio | Personal portfolio with polished branding and motion. | Single-page navigation, responsive sections, external icon/font libraries, theme toggle, scroll-linked anchors, animation on reveal, project cards, contact links. |
| Portfolio_1.0 | Older futuristic portfolio/resume-style landing page. | Tailwind CSS, responsive navigation, hero section, mobile menu, custom typography, dark theme, glassmorphism cards, typing effect, scroll-based page sections, icon library usage. |
| Product_Landing_Page | Product landing page for a fictional eco gadget. | Sticky header, hero section, email signup form, theme toggle with persistence, product sections, responsive layout, localStorage, image-based branding. |
| RPG_Creature_Search_App | Creature lookup app that fetches and displays RPG character data from an external API. | Fetch API, async/await, search input, API error handling, dynamic DOM rendering, stat display, type badges, uppercase formatting, minimal responsive card layout. |
| React/Step1/step1 | Small React form example with controlled input and submission. | React components, useState, controlled form input, submit handler, preventDefault, state reset after submit, StrictMode root rendering. |
| Redesign | Interactive resume transformation explainer with charts and tabs. | Tailwind CSS, tabbed interface, Chart.js, responsive content sections, data visualization, structured content cards, professional layout. |
| RomanNumeralConvertor | Decimal-to-Roman numeral converter. | Mapping table, greedy iteration, input handling, formatted output, conversion logic, DOM updates. |
| Spreadsheet | Browser spreadsheet with formula evaluation and cell references. | Dynamic grid generation, formula parser, dependency tracking, circular reference handling, range expansion, built-in functions, recalculation propagation, keyboard navigation, DOM-driven cell editing. |
| Survey_Form | Responsive survey form for collecting user feedback. | Form controls, text inputs, email/number fields, dropdowns, radio buttons, checkboxes, textarea, labels, responsive layout, accessibility-friendly structure. |
| Tribute_Page | Tribute page for Dr. Norman Borlaug. | Semantic content sections, image and caption, typography hierarchy, external link, responsive layout, accessible structure. |

## Reusable Feature Inventory

These are the most reusable building blocks across the workspace:

| Feature | Appears in |
| --- | --- |
| DOM event handling | Cash_Register, DecimalToBinary, Dice_Game, Forum_Page, palindrome_checker, RomanNumeralConvertor, Spreadsheet |
| Forms and user input | Cash_Register, Product_Landing_Page, React/Step1/step1, Survey_Form, RomanNumeralConvertor, palindrome_checker |
| Data fetching / loading | Forum_Page, platformer_game |
| State management | Dice_Game, platformer_game, React/Step1/step1, Spreadsheet |
| Responsive layout | Documentation_Page, Portfolio, Portfolio_1.0, Product_Landing_Page, Survey_Form, Tribute_Page, Redesign |
| Navigation and section anchors | Documentation_Page, Portfolio, Portfolio_1.0, Product_Landing_Page, Tribute_Page |
| Animation and motion | DecimalToBinary, Dice_Game, Portfolio, Portfolio_1.0, Redesign |
| Tables and structured lists | Forum_Page, Spreadsheet, Redesign |
| Validation and conditional UI feedback | Cash_Register, palindrome_checker, Spreadsheet, Survey_Form |
| External libraries / frameworks | Portfolio_1.0, Product_Landing_Page, Redesign, React/Step1/step1 |

## Notes For A Combined Project

If you want to merge these into one larger project later, the most compatible feature groups are:

1. Content and presentation layers: Tribute_Page, Documentation_Page, Portfolio, Portfolio_1.0, Product_Landing_Page, Redesign.
2. Utility tools: Cash_Register, DecimalToBinary, RomanNumeralConvertor, palindrome_checker, Spreadsheet.
3. Interactive experiences: Dice_Game, Forum_Page, platformer_game, React/Step1/step1.
