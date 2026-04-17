# Panther Lounge Website Navigation Tips

## Website Structure
- **Homepage**: http://localhost:5000/ - Main landing page with introduction
- **Guitar Chords**: http://localhost:5000/guitar-chords - Main chords interface
- **Authentication**: http://localhost:5000/auth - Login/registration routes
- **Profile**: http://localhost:5000/profile - User profile management
- **API**: http://localhost:5000/api - API endpoints

## Key Navigation Elements
1. **Main Navigation Links**:
   - "Guitar Chords" (current) - Links to guitar chords page
   - "Login" - Links to authentication page

2. **Homepage Call-to-Action**:
   - Button: "Check out some chords!" - Navigates to guitar chords page

3. **Guitar Chords Page Features**:
   - Search functionality for songs
   - Filter options by difficulty, genre, etc.
   - Song listings with chord diagrams
   - Individual song view with full chords and lyrics

## Common Tasks Workflow

### Browsing Songs:
1. From homepage, click "Check out some chords!" or navigate to `/guitar-chords`
2. Use search bar to find specific songs/artists
3. Apply filters to narrow results
4. Click on song title to view full chords/lyrics

### User Authentication:
1. Navigate to `/auth` or click "Login" link
2. Options for:
   - Local account login/signup
   - Google OAuth login
3. After login, redirected to profile page

### Profile Management:
1. Access via `/profile` after login
2. View/edit profile information
3. Manage connected accounts (Google linking)
4. View song statistics and activity

## Technical Notes for AI Agents
- The application runs on PORT 5000 (configured in .env)
- Database connection uses MongoDB Atlas (connection string in .env)
- Authentication uses Passport.js with local and Google strategies
- Session management uses cookie-session middleware
- Views are rendered using EJS with express-layouts
- Static files served from `/public` directory

## Common URL Patterns
- `/` - Homepage
- `/auth/*` - Authentication routes (login, logout, Google OAuth)
- `/profile/*` - Profile management
- `/guitar-chords/*` - Song browsing and viewing
- `/api/*` - API endpoints for AJAX operations

## Troubleshooting Tips
- If page doesn't load, check if server is running (`npm run startNodemon`)
- Authentication issues may relate to session cookie configuration
- Database connection errors check .env DBCONNECTION variable
- Chords display issues may relate to public/assets or CSS files

## Recent Changes (from session)
- Created migration script to remove deprecated nArtist/nTitle fields
- Verified homepage and guitar chords navigation works
- Confirmed server is running on localhost:5000