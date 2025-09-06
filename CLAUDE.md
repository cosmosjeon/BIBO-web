# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Architecture

This is a Next.js 15 application using App Router with the following key technologies:

### Core Stack
- **Next.js 15** with App Router and Turbopack
- **React 19** with TypeScript
- **TailwindCSS 4** for styling
- **GSAP** with ScrollTrigger for animations
- **Framer Motion** for additional animations

### Project Structure
```
src/
├── app/                          # Next.js App Router pages
├── components/
│   ├── ui/                      # shadcn-ui components
│   └── [other-components]/      # General components
├── features/[featureName]/      # Feature-based organization
│   ├── components/              # Feature-specific components
│   ├── hooks/                   # Feature-specific hooks
│   └── [other-feature-dirs]/
├── hooks/                       # Global hooks
└── lib/                         # Utility functions
```

### Key Features
- **Scroll-based animations** using GSAP ScrollTrigger
- **Responsive design** with mobile-first approach
- **Custom hooks** for mouse position tracking and scroll control
- **Animation-heavy UI** with smooth transitions and scroll-triggered effects

## Development Guidelines

### Component Requirements
- **Always use 'use client' directive** - All components must be client components
- **Always use promise** for page.tsx params props
- **Responsive design is mandatory** - Every component must work on mobile, tablet, and desktop
- Use flexible units (%, rem, em, vw, vh) instead of fixed pixels
- Test responsiveness across devices before finalizing

### Code Standards
- Follow TypeScript best practices
- Use functional programming patterns
- Avoid mutations, prefer immutable operations
- Use descriptive names for variables and functions
- Minimal comments - code should be self-documenting
- Early returns over nested conditionals
- Pure functions where possible

### Animation Architecture
- GSAP is the primary animation library
- ScrollTrigger for scroll-based animations
- Custom hooks handle animation logic (e.g., `useMousePosition`, `useScrollPhaseControl`)
- Responsive breakpoints: mobile (<768px), tablet, desktop
- Always check for `prefers-reduced-motion` for accessibility

### Styling Approach
- TailwindCSS for utility-first styling
- Responsive classes for all breakpoints
- clamp() functions for fluid typography and spacing
- CSS Grid and Flexbox for layouts
- Custom cursor effects and interactive elements

## Important Notes

### Responsiveness Requirements
- **Critical**: Always implement responsive design - layouts must adapt fluidly across screen sizes
- Use consistent breakpoints: small (<768px), medium, large screens
- Validate responsiveness before completing any implementation
- Consider cross-impacts when modifying code sections

### Animation Performance
- Use GSAP context for proper cleanup
- Register ScrollTrigger plugin before use
- Consider mobile performance with simpler animations
- Use `gsap.set()` for initial states to prevent flashing

### File Patterns
- Feature-based organization for complex functionality
- Custom hooks for reusable logic
- UI components in shadcn-ui structure
- TypeScript for all files

This codebase emphasizes smooth, responsive user experiences with heavy use of scroll-triggered animations and interactive elements.