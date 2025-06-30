# Vercel Deployment Configuration

This file contains the configuration needed for Vercel deployment.

## Required Environment Variables

Set these in your Vercel project dashboard under Settings > Environment Variables:

### Database
- `DATABASE_URL`: Your PostgreSQL connection string
  - Example: `postgresql://username:password@hostname:port/database_name`
  - Recommended providers: Neon, Supabase, PlanetScale

### OpenAI
- `OPENAI_API_KEY`: Your OpenAI API key for the chatbot functionality
  - Get this from: https://platform.openai.com/api-keys

### Production Settings
- `NODE_ENV`: Set to `production`

## Deployment Commands

The following npm scripts are configured for Vercel:
- `npm run build:vercel`: Builds the application for Vercel deployment
- `npm run vercel-build`: Alternative build command for Vercel

## Domain Configuration

### Custom Domain
If you're using a custom domain, update the Open Graph meta tags in `client/index.html`:
```html
<meta property="og:url" content="https://your-custom-domain.com">
```

### Base Path
The application is configured to work at the root path (`/`) in production.

## Database Setup

After deployment, run the database migrations:
```bash
npm run db:push
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Ensure `DATABASE_URL` is correctly set in Vercel environment variables
   - Verify your database is accessible from Vercel's regions

2. **OpenAI API Errors**
   - Check that `OPENAI_API_KEY` is set and valid
   - Ensure your OpenAI account has sufficient credits

3. **Build Failures**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are listed in `package.json`

4. **Function Timeout**
   - Vercel Functions have a 10-second timeout on Hobby plan
   - Consider upgrading to Pro for longer timeouts if needed
