# StarQI - Quick Start Guide

## Fastest Way to Get Started (Using Docker)

### 1. Prerequisites
- Install Docker Desktop: https://www.docker.com/products/docker-desktop
- Ensure Docker is running

### 2. Setup and Run

```bash
# Navigate to project directory
cd starqi

# Copy environment file
cp .env.example .env

# Start all services
docker-compose up -d

# Wait for services to start (30-60 seconds)
# Check logs if needed:
docker-compose logs -f
```

### 3. Access the Application

Open your browser:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/health

### 4. Test the Application

1. **Upload a Photo**:
   - Go to http://localhost:5173/upload
   - Click "Use Current Location" or manually enter coordinates
   - Drag & drop a night sky photo
   - Click "Upload & Analyze"
   - View your results!

2. **Explore the Map**:
   - Go to http://localhost:5173
   - Scroll down to the map section
   - Click on markers to see readings

3. **View Statistics**:
   - Check the dashboard on the home page
   - See global light pollution statistics

## Manual Setup (Without Docker)

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

### 2. Setup MySQL Database

```sql
-- Login to MySQL
mysql -u root -p

-- Create database and user
CREATE DATABASE starqi;
CREATE USER 'starqi_user'@'localhost' IDENTIFIED BY 'starqi_pass';
GRANT ALL PRIVILEGES ON starqi.* TO 'starqi_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Configure Environment

**server/.env:**
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=starqi_user
DB_PASSWORD=starqi_pass
DB_DATABASE=starqi
JWT_SECRET=your_secret_key_here
CORS_ORIGIN=http://localhost:5173
```

**client/.env:**
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start Development Servers

```bash
# From root directory - starts both frontend and backend
npm run dev
```

Or start them separately:

```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend
npm run dev:client
```

### 5. Access Application

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Stopping the Application

### Docker:
```bash
docker-compose down
```

### Manual:
Press `Ctrl+C` in each terminal running the servers

## Troubleshooting

### Database Connection Error
```bash
# Check if MySQL is running
docker-compose ps  # (Docker)
mysql -u root -p   # (Manual)

# Check environment variables
cat server/.env
```

### Port Already in Use
```bash
# Change ports in docker-compose.yml or .env files
# Frontend port: 5173
# Backend port: 5000
# Database port: 3306
```

### Image Upload Not Working
```bash
# Check uploads directory exists
mkdir -p server/uploads

# Check file permissions
chmod 755 server/uploads
```

### Frontend Build Errors
```bash
# Clear cache and reinstall
cd client
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. **Create an Account** (optional):
   - Currently authentication is optional for uploads
   - Register to track your contributions

2. **Upload Multiple Photos**:
   - Take photos from different locations
   - Compare light pollution levels

3. **Explore the Data**:
   - View global statistics
   - Check the interactive map
   - Find dark sky locations

4. **Get an SQM Device** (future):
   - Purchase a Sky Quality Meter
   - Register it in the system
   - Submit automated readings

## Development Tips

### View Database Tables
```bash
# Docker
docker exec -it starqi-db mysql -u starqi_user -p starqi

# Manual
mysql -u starqi_user -p starqi
```

### View Logs
```bash
# Docker
docker-compose logs -f server
docker-compose logs -f client

# Manual - check terminal output
```

### Reset Database
```bash
# Stop services
docker-compose down

# Remove database volume
docker volume rm starqi_mysql_data

# Start fresh
docker-compose up -d
```

## Support

For issues or questions:
- Check the main [README.md](./README.md)
- Review [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)
- Open an issue on GitHub

Happy sky watching! 🌌
