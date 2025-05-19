# Aptify Deployment Guide

This guide provides step-by-step instructions for deploying the Aptify application to popular hosting platforms.

## Prerequisites

Before deploying, ensure you have:

1. A fully functioning local version of the application
2. A Google Gemini API key
3. An account on your chosen hosting platform (Vercel, Render, etc.)

## Deployment Options

### 1. Vercel Deployment

Vercel is an excellent platform for deploying Flask applications with minimal configuration.

#### Steps:

1. **Prepare your application**:
   - Ensure your `vercel.json` file is configured correctly (already included in the repo)
   - Make sure your `requirements.txt` lists all dependencies

2. **Deploy via Vercel CLI**:
   ```bash
   # Install Vercel CLI if you haven't already
   npm install -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy from your project directory
   vercel --prod
   ```

3. **Or deploy via GitHub integration**:
   - Push your code to a GitHub repository
   - Login to Vercel dashboard
   - Create a new project and import from your GitHub repository
   - Configure environment variables (add `GEMINI_API_KEY`)
   - Deploy

4. **Verify the deployment**:
   - Check the provided Vercel URL
   - Ensure all functionality works in the deployed version

### 2. Render Deployment

Render provides a simple way to deploy Flask applications with automatic SSL.

#### Steps:

1. **Create a Render account** at [render.com](https://render.com) if you don't have one

2. **Create a new Web Service**:
   - Connect your GitHub repository
   - Select the repository containing your Aptify application

3. **Configure the service**:
   - Name: `aptify` (or your preferred name)
   - Runtime: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn --bind 0.0.0.0:$PORT main:app`
   - Instance Type: Select as per your needs (Free tier available)

4. **Add environment variables**:
   - Click on "Environment" and add:
     - Key: `GEMINI_API_KEY`
     - Value: Your Google Gemini API key

5. **Deploy**:
   - Click "Create Web Service"
   - Wait for the deployment to complete

6. **Verify the deployment**:
   - Access your application at the provided Render URL

### 3. Heroku Deployment

Heroku is another popular platform for Flask applications.

#### Steps:

1. **Install Heroku CLI** and login:
   ```bash
   # Install Heroku CLI
   npm install -g heroku
   
   # Login to Heroku
   heroku login
   ```

2. **Create a Procfile** in your project root:
   ```
   web: gunicorn main:app
   ```

3. **Create a new Heroku app**:
   ```bash
   heroku create aptify-app
   ```

4. **Add environment variables**:
   ```bash
   heroku config:set GEMINI_API_KEY=your_api_key
   ```

5. **Deploy to Heroku**:
   ```bash
   git push heroku main
   ```

6. **Verify the deployment**:
   ```bash
   heroku open
   ```

## Post-Deployment Steps

After deploying to any platform, always perform these checks:

1. **Test all features**:
   - Home page loads correctly
   - Quiz initialization works
   - Questions are generated via Gemini API
   - Results page displays correctly
   - PDF generation functions properly
   - Leaderboard works as expected

2. **Check mobile responsiveness**:
   - Test on various device sizes
   - Ensure UI elements are properly aligned and scaled

3. **Monitor application logs**:
   - Check for any errors or issues
   - Monitor API usage and performance

4. **Set up analytics** (optional):
   - Add Google Analytics or similar service
   - Track user engagement and feature usage

## Troubleshooting Common Issues

### API Key Issues

If your application shows errors related to the Gemini API:

1. Verify the API key is set correctly in environment variables
2. Check API usage limits and quotas
3. Test the API key in a separate tool or command-line request

### Database-Related Issues

If deploying with a database in the future:

1. Ensure database connection strings are correctly configured
2. Verify database migrations have been applied
3. Check for any firewall or network restrictions

### Performance Issues

If the application seems slow:

1. Consider upgrading your hosting plan
2. Implement caching for API responses
3. Optimize assets and reduce payload sizes

## Security Considerations

1. **Ensure API keys are secure**:
   - Never commit API keys to your repository
   - Always use environment variables for sensitive information

2. **Enable HTTPS**:
   - Most platforms provide this automatically
   - If not, set up a custom domain with SSL certificate

3. **Implement rate limiting** if needed to prevent abuse

## Conclusion

Your Aptify application should now be successfully deployed and accessible online. Share the URL with BTech students to help them prepare for their campus placements!

For any further questions or issues, refer to the documentation of your hosting provider or create an issue in the project repository.