# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Production build with Turbopack  
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture Overview

This is a Next.js 15 todo application with Firebase backend integration, built with TypeScript and Tailwind CSS.

### Tech Stack
- **Framework**: Next.js 15.5.2 with App Router and Turbopack
- **React**: 19.1.0 with client components for interactivity
- **Firebase**: Complete integration (v12.2.1) - Auth, Firestore, Storage, Realtime DB, Functions, Analytics
- **State Management**: Zustand 5.0.8 for client state
- **Forms**: React Hook Form 7.62.0
- **Styling**: Tailwind CSS 4.x with custom todo-specific color system
- **Utilities**: date-fns for date handling, react-firebase-hooks for Firebase integration

### Key Directories
- `/app/` - Next.js App Router with layout.tsx wrapping AuthProvider
- `/contexts/` - React contexts, primarily AuthContext.tsx for Firebase auth
- `/lib/` - Utilities and configurations, including firebase.ts setup
- `/types/` - TypeScript definitions for Todo, User, Priority, Status, UserPresence
- `/components/`, `/hooks/`, `/stores/` - Planned modular architecture (currently empty)

### Authentication System
- Context-based auth using AuthContext that wraps the entire app in layout.tsx
- Firebase Auth with email/password and Google OAuth support
- User type includes uid, email, displayName, photoURL
- Landing page (app/page.tsx) auto-redirects authenticated users to /dashboard

### Firebase Configuration
- All Firebase services initialized in lib/firebase.ts
- Uses Next.js environment variables for configuration
- Services: auth, db (Firestore), storage, realtimeDb, functions, analytics
- Analytics only loads in browser environment with feature detection

### Styling System
- Tailwind CSS with comprehensive custom color palette
- Priority colors: priority-low (green), priority-medium (yellow), priority-high (red), priority-urgent (dark red)
- Status colors: status-todo (gray), status-in-progress (blue), status-done (green), status-archived (light gray)
- Theme colors: primary (blue), secondary (purple), plus success/warning/error/info variants
- Dark mode support via CSS custom properties and prefers-color-scheme

### TypeScript Configuration
- Strict mode enabled with ES2017 target
- Path alias: `@/*` maps to project root
- Modern module resolution with Next.js TypeScript plugin

### Current Development State
- Core infrastructure complete: Firebase setup, auth context, type definitions, styling system
- Routes planned but not implemented: /dashboard, /signin, /signup, /todos/[id]/edit
- Components, hooks, and stores directories exist but are empty - follow modular patterns when implementing