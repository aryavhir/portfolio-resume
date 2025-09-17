# Overview

This is a React-based portfolio website showcasing a developer's skills, projects, and contact information. The application features modern 3D graphics, interactive components, and a professional design with animated elements. Built with React 18 and Create React App, it includes sections for skills visualization, project showcases, GitHub integration, contact forms, and newsletter subscription functionality.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with functional components and hooks
- **Styling**: Bootstrap 5.3 for responsive grid system and components, custom CSS for animations and theming
- **3D Graphics**: Three.js with React Three Fiber for interactive 3D workspace visualization and liquid ether background effects
- **Animations**: Animate.css library for smooth transitions and visual effects
- **Routing**: React Router DOM for client-side navigation with hash links for smooth scrolling
- **Component Structure**: Modular component architecture with separate files for Banner, Skills, Projects, Contact, Footer, NavBar, and specialized 3D components

## State Management
- **Local State**: React useState and useEffect hooks for component-level state management
- **Form Handling**: Controlled components for contact forms and newsletter subscription
- **Theme Management**: Dark/light mode toggle with persistent state

## Email Integration
- **Service**: EmailJS for client-side email functionality without backend server requirements
- **Forms**: Contact form and newsletter subscription with real-time validation and status feedback
- **Configuration**: Template-based email system with customizable parameters

## Data Fetching
- **GitHub API**: Direct API calls to fetch user profile data, repositories, and commit history
- **Rate Limiting**: Optional GitHub token support for higher API rate limits
- **Error Handling**: Comprehensive error states and loading indicators

## Performance Optimizations
- **Code Splitting**: Lazy loading with React Suspense for 3D components
- **Animation Management**: Intersection Observer for visibility-based animations
- **Responsive Design**: Mobile-first approach with Bootstrap breakpoints

# External Dependencies

## Core Technologies
- **React**: 18.3.1 - Main frontend framework
- **React DOM**: 18.3.1 - DOM rendering
- **Bootstrap**: 5.3.3 - CSS framework and responsive grid
- **React Bootstrap**: 2.10.4 - Bootstrap components for React

## 3D Graphics and Animation
- **Three.js**: 0.169.0 - 3D graphics library
- **@react-three/fiber**: 8.18.0 - React renderer for Three.js
- **@react-three/drei**: 9.122.0 - Useful helpers for React Three Fiber
- **Animate.css**: 4.1.1 - CSS animation library

## UI Components and Interactions
- **react-multi-carousel**: 2.8.5 - Carousel component for skills showcase
- **react-on-screen**: 2.1.1 - Intersection Observer wrapper for scroll animations
- **react-player**: 2.16.0 - Media player component
- **react-bootstrap-icons**: 1.11.4 - Icon library

## Routing and Navigation
- **react-router-dom**: 6.25.1 - Client-side routing
- **react-router-hash-link**: 2.4.3 - Smooth scrolling hash links

## Email and Communication
- **emailjs-com**: 3.2.0 - Client-side email service
- **react-mailchimp-subscribe**: 2.1.3 - Newsletter subscription integration

## Backend Server (Optional)
- **Express**: 4.19.2 - Node.js web framework for optional backend functionality
- **CORS**: 2.8.5 - Cross-origin resource sharing middleware
- **Nodemailer**: 6.9.14 - Email sending library for server-side email functionality
- **dotenv**: 16.4.5 - Environment variable management

## External APIs
- **GitHub API**: For fetching user profile, repositories, and commit data
- **EmailJS**: For contact form and newsletter email delivery
- **Mailchimp**: For newsletter subscription management (optional)