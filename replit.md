# Programme FUTUR - Certificate Authentication Platform

## Overview

This is a web-based certificate authentication platform for Programme FUTUR, designed to verify student certificates through matriculation number lookup. The application provides a simple student search interface with admin functionality for managing student records.

## User Preferences

Preferred communication style: Simple, everyday language.
Language preference: French (Français)

## System Architecture

The application follows a simple client-side architecture:

- **Frontend**: Single-page application using vanilla HTML, CSS (Tailwind), and JavaScript
- **Data Layer**: Static JavaScript array containing student information
- **Styling**: Tailwind CSS framework with custom configuration
- **Assets**: Local image storage for student photos

## Key Components

### Frontend Structure
- **index.html**: Main application interface with search functionality and admin access
- **script.js**: Core application logic handling search, admin authentication, and student management
- **data.js**: Static student database with 48 student records
- **images/**: Directory for student photographs (referenced but not included)

### Student Data Model
Each student record contains:
- Unique ID
- Matriculation number (format: PF-NATI-2025-XXXX)
- Full name
- Program track (Développement Web)
- Photo reference path

### User Interface Components
1. **Header Navigation**: FuturCerty logo and brand with admin access button
2. **Search Interface**: Input field for matriculation number lookup (supports both PF-NATI-2025-XXXX and NATI-2025-XXXX formats)
3. **Student Display Card**: Shows verified student information with photo and download button
4. **Admin Panel**: Protected interface with two tabs - add students and view all students
5. **Authentication Modal**: Login interface for admin access
6. **Footer**: Complete footer with contact information and useful links
7. **Certificate Download**: Printable certificate generation functionality

## Data Flow

1. **Student Lookup**: User enters matriculation number (PF-NATI-2025-XXXX or NATI-2025-XXXX) → system searches static array → displays student card with download option if found
2. **Admin Access**: Admin clicks admin button in header → modal appears → password verification → admin panel with tabs access
3. **Student Addition**: Admin fills form in "Add Student" tab → new student added to array → interface updates
4. **Student Management**: Admin can view all students in "All Students" tab with search functionality
5. **Certificate Download**: User clicks download button → opens printable certificate in new window

## External Dependencies

- **Tailwind CSS**: CDN-loaded for styling framework
- **Google Fonts**: Montserrat font family for typography
- No backend server dependencies
- No database connections required

## Deployment Strategy

The application is designed for simple static hosting:

- **Static Files**: All content served as static files
- **No Server Requirements**: Runs entirely in browser
- **Port Configuration**: References port 5000 for development
- **Asset Management**: Images stored locally in /images directory

### Deployment Considerations
- Requires web server for proper file serving (not file:// protocol)
- Image assets need to be populated in /images directory
- Admin password is hardcoded (security consideration for production)
- Student data updates require code deployment (no dynamic database)

### Current Limitations
- Student data is static (no persistent storage)
- Basic admin authentication (no session management)
- Image placeholders need actual student photos
- No backup or recovery mechanisms for data changes

The architecture prioritizes simplicity and ease of deployment while providing the core functionality needed for certificate verification.