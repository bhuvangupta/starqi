# 🚀 StarQI Deployment Guide

Complete guide for deploying StarQI to production environments.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Server Setup](#server-setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [SSL Certificate Setup](#ssl-certificate-setup)
6. [Application Deployment](#application-deployment)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)
9. [Backup & Recovery](#backup--recovery)

---

## Prerequisites

### Server Requirements

**Minimum Specifications:**
- OS: Ubuntu 20.04 LTS or later
- CPU: 2 cores
- RAM: 4GB
- Storage: 50GB SSD
- Network: 100 Mbps

**Recommended Specifications:**
- OS: Ubuntu 22.04 LTS
- CPU: 4 cores
- RAM: 8GB
- Storage: 100GB SSD
- Network: 1 Gbps

### Required Software

```bash
- Docker 24.0+
- Docker Compose 2.20+
- Git 2.34+
- OpenSSL 1.1+
```

### Domain & DNS

- Registered domain name
- DNS A record pointing to your server IP
- Optional: CDN setup (Cloudflare recommended)

---

## Server Setup

### 1. Initial Server Configuration

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y \
    curl \
    wget \
    git \
    ufw \
    fail2ban \
    certbot \
    python3-certbot-nginx

# Create deployment user
sudo adduser deploy
sudo usermod -aG sudo deploy
sudo usermod -aG docker deploy

# Switch to deployment user
su - deploy
```

### 2. Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### 3. Configure Firewall

```bash
# Allow SSH, HTTP, HTTPS
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Check status
sudo ufw status
```

### 4. Configure Fail2ban

```bash
# Copy default config
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Edit configuration
sudo nano /etc/fail2ban/jail.local

# Restart fail2ban
sudo systemctl restart fail2ban
sudo systemctl enable fail2ban
```

---

## Environment Configuration

### 1. Clone Repository

```bash
cd /var/www
sudo git clone https://github.com/yourusername/starqi.git
sudo chown -R deploy:deploy starqi
cd starqi
```

### 2. Setup Environment Variables

#### Option A: Automated Setup

```bash
chmod +x setup/setup-env.sh
./setup/setup-env.sh production
```

#### Option B: Manual Setup

```bash
# Copy example files
cp .env.example .env.production
cp server/.env.example server/.env
cp client/.env.example client/.env

# Edit files with your values
nano .env.production
nano server/.env
nano client/.env
```

### 3. Environment Variables Reference

**Required Variables:**

```env
# Database
DB_HOST=db
DB_PORT=3306
DB_USERNAME=starqi_user
DB_PASSWORD=your_secure_password_here
DB_DATABASE=starqi
DB_ROOT_PASSWORD=your_root_password_here

# JWT
JWT_SECRET=your_super_secure_jwt_secret_minimum_32_chars
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=production
BASE_URL=https://yourdomain.com
CORS_ORIGIN=https://yourdomain.com

# API
VITE_API_URL=https://yourdomain.com/api

# Redis (Optional)
REDIS_PASSWORD=your_redis_password
```

### 4. Generate Secure Secrets

```bash
# Generate JWT secret
openssl rand -base64 32

# Generate database passwords
openssl rand -base64 24

# Generate Redis password
openssl rand -base64 24
```

---

## Database Setup

### 1. Initialize Database

```bash
# Start database container
docker-compose -f docker-compose.prod.yml up -d db

# Wait for database to be ready
sleep 30

# Run initialization script
docker exec -i starqi-db-prod mysql -uroot -p${DB_ROOT_PASSWORD} < setup/database.sql
```

### 2. Verify Database

```bash
# Connect to database
docker exec -it starqi-db-prod mysql -ustarqi_user -p

# Check tables
USE starqi;
SHOW TABLES;
SELECT COUNT(*) FROM locations;
EXIT;
```

---

## SSL Certificate Setup

### Option A: Let's Encrypt (Recommended)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Certificates will be in:
# /etc/letsencrypt/live/yourdomain.com/

# Copy to project
sudo mkdir -p ssl
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/
sudo chown -R deploy:deploy ssl/

# Auto-renewal (runs twice daily)
sudo certbot renew --dry-run
```

### Option B: Custom Certificate

```bash
# Create ssl directory
mkdir -p ssl

# Copy your certificates
cp /path/to/fullchain.pem ssl/
cp /path/to/privkey.pem ssl/
chmod 600 ssl/privkey.pem
```

---

## Application Deployment

### 1. Build & Start Services

```bash
cd /var/www/starqi

# Make deployment script executable
chmod +x setup/deploy.sh

# Run deployment
./setup/deploy.sh production
```

### 2. Manual Deployment Steps

If automated deployment fails:

```bash
# Pull latest code
git pull origin main

# Build and start services
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 3. Verify Deployment

```bash
# Check running containers
docker ps

# Test health endpoint
curl http://localhost:5000/health

# Test frontend
curl http://localhost

# Check logs
docker-compose -f docker-compose.prod.yml logs -f server
```

### 4. Configure Nginx (if not using Docker)

```bash
# Copy nginx config
sudo cp setup/nginx.conf /etc/nginx/sites-available/starqi

# Create symbolic link
sudo ln -s /etc/nginx/sites-available/starqi /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

---

## Monitoring & Maintenance

### 1. Setup Logging

```bash
# View all logs
docker-compose -f docker-compose.prod.yml logs -f

# View specific service
docker-compose -f docker-compose.prod.yml logs -f server

# Save logs to file
docker-compose -f docker-compose.prod.yml logs > deployment.log
```

### 2. Setup Monitoring

**Install monitoring tools:**

```bash
# Install htop
sudo apt install htop

# Install docker stats
docker stats

# Install netdata (optional)
bash <(curl -Ss https://my-netdata.io/kickstart.sh)
```

### 3. Performance Optimization

**Database Optimization:**

```bash
# Connect to database
docker exec -it starqi-db-prod mysql -uroot -p

# Optimize tables
USE starqi;
OPTIMIZE TABLE sky_readings;
OPTIMIZE TABLE photo_uploads;
OPTIMIZE TABLE users;
```

**Docker Cleanup:**

```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove unused networks
docker network prune

# Full cleanup
docker system prune -a --volumes
```

### 4. Automated Backups

```bash
# Create backup script
cat > /var/www/starqi/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/starqi"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
docker exec starqi-db-prod mysqldump -uroot -p$DB_ROOT_PASSWORD starqi | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/starqi/uploads/

# Remove backups older than 30 days
find $BACKUP_DIR -type f -mtime +30 -delete

echo "Backup completed: $DATE"
EOF

chmod +x /var/www/starqi/backup.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /var/www/starqi/backup.sh") | crontab -
```

---

## Troubleshooting

### Common Issues

**1. Database Connection Errors**

```bash
# Check database container
docker logs starqi-db-prod

# Verify credentials
docker exec -it starqi-db-prod mysql -ustarqi_user -p

# Restart database
docker-compose -f docker-compose.prod.yml restart db
```

**2. Application Not Starting**

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs server

# Check environment variables
docker-compose -f docker-compose.prod.yml config

# Rebuild containers
docker-compose -f docker-compose.prod.yml up -d --build
```

**3. SSL Certificate Issues**

```bash
# Check certificate validity
openssl x509 -in ssl/fullchain.pem -text -noout

# Renew certificate
sudo certbot renew

# Update permissions
chmod 600 ssl/privkey.pem
```

**4. High Memory Usage**

```bash
# Check container stats
docker stats

# Restart containers
docker-compose -f docker-compose.prod.yml restart

# Increase Docker memory limit
# Edit /etc/docker/daemon.json
```

**5. Slow Performance**

```bash
# Check database queries
docker exec -it starqi-db-prod mysql -uroot -p
SHOW PROCESSLIST;

# Optimize database
OPTIMIZE TABLE sky_readings;

# Clear application cache
docker-compose -f docker-compose.prod.yml restart redis
```

---

## Backup & Recovery

### Backup Strategy

**Daily Automated Backups:**
- Database dumps
- Uploaded files
- Configuration files

**Weekly Full Backups:**
- Complete system backup
- Offsite backup storage

### Manual Backup

```bash
# Database backup
docker exec starqi-db-prod mysqldump -uroot -p$DB_ROOT_PASSWORD starqi > backup_$(date +%Y%m%d).sql

# Uploads backup
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz uploads/

# Configuration backup
tar -czf config_backup_$(date +%Y%m%d).tar.gz .env* server/.env client/.env
```

### Recovery

```bash
# Restore database
docker exec -i starqi-db-prod mysql -uroot -p$DB_ROOT_PASSWORD starqi < backup_20250115.sql

# Restore uploads
tar -xzf uploads_backup_20250115.tar.gz -C /

# Restart services
docker-compose -f docker-compose.prod.yml restart
```

---

## Security Checklist

- [ ] Strong database passwords
- [ ] Secure JWT secret (minimum 32 characters)
- [ ] SSL/TLS certificates installed
- [ ] Firewall configured (UFW)
- [ ] Fail2ban configured
- [ ] Docker containers run as non-root
- [ ] Regular security updates
- [ ] Backup strategy in place
- [ ] Monitoring and alerting set up
- [ ] API rate limiting enabled
- [ ] CORS properly configured
- [ ] Security headers configured
- [ ] Database credentials not in code
- [ ] Environment files not in version control

---

## Production Checklist

- [ ] Domain configured and DNS pointing to server
- [ ] SSL certificates installed and auto-renewal configured
- [ ] Environment variables properly set
- [ ] Database initialized with seed data
- [ ] Application builds without errors
- [ ] All services starting correctly
- [ ] Health checks passing
- [ ] Logs being captured
- [ ] Backups configured and tested
- [ ] Monitoring tools installed
- [ ] Firewall rules configured
- [ ] Performance optimizations applied
- [ ] Documentation updated
- [ ] Team notified of deployment

---

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [MySQL Performance Tuning](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## Support

For deployment issues:
- Check [Troubleshooting](#troubleshooting) section
- Review application logs
- Open an issue on GitHub
- Contact support@starqi.org

---

**Last Updated**: January 2025
**Version**: 1.0.0
