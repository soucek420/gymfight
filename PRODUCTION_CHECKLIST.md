# Production Deployment Checklist

Use this checklist before deploying Gym Fight to production.

## 🔒 Security

- [ ] Changed default JWT_SECRET in backend/.env to a secure random string
- [ ] Removed or secured any development/debug endpoints
- [ ] Enabled HTTPS/SSL for all connections
- [ ] Configured CORS to allow only production domains
- [ ] Set secure cookie flags (httpOnly, secure, sameSite)
- [ ] Implemented rate limiting on API endpoints
- [ ] Updated all default passwords/secrets
- [ ] Enabled MongoDB authentication
- [ ] Reviewed and tested authentication flows
- [ ] Set appropriate session timeouts

## 🌍 Environment Configuration

- [ ] Created production .env file with correct values
- [ ] Set NODE_ENV=production
- [ ] Configured production MongoDB connection string
- [ ] Set correct frontend API URL in .env.production
- [ ] Verified all environment variables are set
- [ ] Removed all console.log statements or use proper logging
- [ ] Configured error tracking (e.g., Sentry)
- [ ] Set up monitoring and alerting

## 📦 Build & Optimization

- [ ] Built frontend with `npm run build`
- [ ] Tested production build locally
- [ ] Enabled gzip compression
- [ ] Optimized images and assets
- [ ] Configured CDN for static assets (optional)
- [ ] Minified and bundled all code
- [ ] Removed source maps from production (or secure them)
- [ ] Implemented code splitting (React lazy loading)

## 🗄️ Database

- [ ] MongoDB is running and accessible
- [ ] Database backup strategy is in place
- [ ] Indexes are created on frequently queried fields
- [ ] Connection pooling is configured
- [ ] Database authentication is enabled
- [ ] Tested database connection limits
- [ ] Set up automated database backups

## 🚀 Server Configuration

### Backend
- [ ] Backend is running on production server
- [ ] Using process manager (PM2 recommended)
- [ ] Backend is set to auto-restart on failure
- [ ] Logs are being collected and rotated
- [ ] Memory limits are configured
- [ ] Backend is not exposed directly (behind Nginx/proxy)

### Frontend
- [ ] Frontend build is deployed
- [ ] Serving from web server (Nginx/Apache) or CDN
- [ ] React Router configured correctly
- [ ] 404 redirects to index.html for SPA routing
- [ ] Static assets are cached properly
- [ ] Compression is enabled

## 🌐 Domain & DNS

- [ ] Domain is registered and configured
- [ ] DNS records point to correct server
- [ ] SSL certificate is installed and valid
- [ ] Certificate auto-renewal is configured
- [ ] www and non-www versions are handled
- [ ] Redirect HTTP to HTTPS

## 📊 Monitoring & Logging

- [ ] Application logs are being collected
- [ ] Error tracking is configured
- [ ] Uptime monitoring is set up
- [ ] Performance monitoring is configured
- [ ] Set up alerts for:
  - [ ] Server downtime
  - [ ] High error rates
  - [ ] High memory/CPU usage
  - [ ] Database connection issues
  - [ ] SSL certificate expiration

## ✅ Testing

- [ ] All features tested in production-like environment
- [ ] Load testing completed
- [ ] Security audit performed
- [ ] API endpoints return expected responses
- [ ] Error handling works correctly
- [ ] Authentication flows work
- [ ] Database operations are performant
- [ ] Mobile responsiveness verified
- [ ] Cross-browser compatibility checked

## 📝 Documentation

- [ ] API documentation is up to date
- [ ] Deployment process is documented
- [ ] Environment variables are documented
- [ ] Backup/restore procedures are documented
- [ ] Rollback procedure is documented
- [ ] Contact information for emergencies is available

## 🔄 CI/CD (Optional but Recommended)

- [ ] Automated testing pipeline is set up
- [ ] Automated deployment is configured
- [ ] Staging environment exists
- [ ] Rollback mechanism is in place
- [ ] Database migration strategy is defined

## 🆘 Emergency Procedures

- [ ] Know how to access server logs
- [ ] Know how to restart services
- [ ] Have database backup restore procedure
- [ ] Have rollback procedure ready
- [ ] Emergency contacts are documented
- [ ] Know how to scale resources if needed

## Post-Deployment

- [ ] Verify all pages load correctly
- [ ] Test user registration and login
- [ ] Test character creation
- [ ] Test workout and diet logging
- [ ] Test combat system
- [ ] Check API response times
- [ ] Monitor error rates for 24-48 hours
- [ ] Verify SSL certificate is working
- [ ] Test from different locations/devices
- [ ] Announce to users (if applicable)

## Regular Maintenance

- [ ] Schedule regular dependency updates
- [ ] Monitor security advisories
- [ ] Review logs weekly
- [ ] Test backups monthly
- [ ] Review and optimize database queries
- [ ] Monitor disk space and resource usage
- [ ] Update documentation as needed

---

## Quick Production Commands

### Deploy Backend
```bash
# Build and start with PM2
cd backend
npm install --production
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### Deploy Frontend
```bash
# Build for production
cd frontend
npm install
npm run build

# Copy to web server
sudo cp -r build/* /var/www/gymfight/
```

### Check Status
```bash
# PM2 processes
pm2 status
pm2 logs

# Nginx status
sudo systemctl status nginx

# MongoDB status
sudo systemctl status mongod
```

### Restart Services
```bash
# Backend
pm2 restart gymfight-backend

# Nginx
sudo systemctl restart nginx

# MongoDB
sudo systemctl restart mongod
```

---

## Resources

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed deployment guide
- [README.md](./README.md) - Application documentation
- [nginx.conf.template](./nginx.conf.template) - Nginx configuration
- [ecosystem.config.js](./ecosystem.config.js) - PM2 configuration

---

**Remember**: Always test in a staging environment before deploying to production!
