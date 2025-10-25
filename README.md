# 🌌 StarQI - Light Pollution Portal

<div align="center">

![StarQI Logo](https://via.placeholder.com/200x200/1e1b4b/ffffff?text=StarQI)

**A Global Platform for Measuring and Visualizing Light Pollution**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

[Features](#features) • [Getting Started](#getting-started) • [Documentation](#documentation) • [Roadmap](./ROADMAP.md) • [Contributing](#contributing)

</div>

---

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Sky Quality Analysis](#sky-quality-analysis)
- [Database Schema](#database-schema)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## 🌟 Overview

**StarQI** (Star Quality Index) is a comprehensive web application designed to measure, track, and visualize light pollution across the globe. Inspired by air quality monitoring platforms like [aqi.in](https://aqi.in), StarQI enables citizen scientists, astronomers, and environmental advocates to contribute to a global database of sky quality measurements.

### Mission

To create awareness about light pollution and its impacts on astronomy, wildlife, human health, and energy consumption by providing accessible tools for measuring and sharing sky quality data worldwide.

### Why Light Pollution Matters

- 🌠 **Astronomy** - Obscures celestial objects, limiting astronomical observations
- 🦉 **Wildlife** - Disrupts migration patterns, feeding behaviors, and ecosystems
- 😴 **Human Health** - Affects circadian rhythms, sleep patterns, and wellbeing
- 💡 **Energy Waste** - Represents wasted energy and unnecessary carbon emissions
- 🏛️ **Cultural Heritage** - Diminishes humanity's connection to the night sky

---

## ✨ Features

### Current Features (v1.0)

#### 📸 Photo-Based Sky Quality Analysis
- Upload night sky photographs for automatic analysis
- Advanced image processing algorithms:
  - Sky brightness measurement
  - Star detection using flood-fill algorithm
  - Horizon glow detection (light pollution signature)
  - Color temperature analysis
  - Automatic SQM value calculation
  - Bortle Dark-Sky Scale classification (1-9)

#### 🗺️ Interactive Global Map
- Real-time visualization of sky quality readings worldwide
- Color-coded markers based on pollution levels
- Detailed popups with reading information
- Responsive map interface using Leaflet
- Filter and search capabilities

#### 📊 Analytics Dashboard
- Global statistics and trends
- Best and worst sky quality locations
- Country-wise reading distribution
- Interactive charts and visualizations
- Historical data analysis

#### 🔐 User Management
- User registration and authentication
- JWT-based secure authentication
- User profiles and contribution tracking
- Optional anonymous submissions

#### 🌐 RESTful API
- Complete REST API for all operations
- Well-documented endpoints
- JSON response format
- Rate limiting and security headers

#### 📱 Responsive Design
- Mobile-friendly interface
- Touch-optimized controls
- Progressive Web App (PWA) ready
- Cross-browser compatibility

### Planned Features (See [ROADMAP.md](./ROADMAP.md))

- Mobile applications (iOS/Android)
- Real-time SQM device integration
- Machine learning-enhanced analysis
- Social features and community engagement
- Advanced reporting and data export
- Multi-language support

---

## 🛠️ Technology Stack

### Frontend

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Framework | 18.2+ |
| **TypeScript** | Type Safety | 5.3+ |
| **Vite** | Build Tool | 5.0+ |
| **TailwindCSS** | Styling | 3.3+ |
| **React Router** | Routing | 6.20+ |
| **React Leaflet** | Maps | 4.2+ |
| **TanStack Query** | Data Fetching | 5.14+ |
| **Zustand** | State Management | 4.4+ |
| **Recharts** | Charts | 2.10+ |
| **React Dropzone** | File Upload | 14.2+ |
| **Axios** | HTTP Client | 1.6+ |

### Backend

| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime | 20+ |
| **TypeScript** | Type Safety | 5.3+ |
| **Express** | Web Framework | 4.18+ |
| **TypeORM** | ORM | 0.3+ |
| **MySQL** | Database | 8.0+ |
| **JWT** | Authentication | 9.0+ |
| **Sharp** | Image Processing | 0.33+ |
| **Multer** | File Upload | 1.4+ |
| **Bcrypt** | Password Hashing | 2.4+ |
| **Helmet** | Security | 7.1+ |
| **Morgan** | Logging | 1.10+ |

### DevOps

| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Orchestration |
| **Nginx** | Reverse Proxy (Production) |
| **PM2** | Process Management (Production) |

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │  Mobile App  │  │   Desktop    │      │
│  │   (React)    │  │   (Future)   │  │   (Future)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway / Nginx                      │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  ┌──────────────────────────────────────────────────┐       │
│  │              Express.js REST API                 │       │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐ │       │
│  │  │   Auth     │  │  Readings  │  │   Users    │ │       │
│  │  │ Controller │  │ Controller │  │ Controller │ │       │
│  │  └────────────┘  └────────────┘  └────────────┘ │       │
│  └──────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     Service Layer                            │
│  ┌──────────────────┐  ┌──────────────────────────┐        │
│  │  Photo Processing│  │   Sky Quality Analyzer   │        │
│  │     Service      │  │   (Image Analysis AI)    │        │
│  └──────────────────┘  └──────────────────────────┘        │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    MySQL     │  │  File Storage│  │    Redis     │      │
│  │   Database   │  │    (S3)      │  │   (Cache)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow - Photo Upload & Analysis

```
1. User uploads photo → 2. Server receives file → 3. Image processing
                                                          ↓
                                                   Extract metadata
                                                          ↓
                                                   Analyze brightness
                                                          ↓
                                                   Detect stars
                                                          ↓
                                                   Calculate SQM
                                                          ↓
                                                   Determine Bortle
                                                          ↓
6. Display results ← 5. Return analysis ← 4. Save to database
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or higher ([Download](https://nodejs.org/))
- **npm** 9.x or higher (comes with Node.js)
- **MySQL** 8.0 or higher ([Download](https://dev.mysql.com/downloads/mysql/))
- **Docker & Docker Compose** (optional, recommended) ([Download](https://www.docker.com/products/docker-desktop))
- **Git** ([Download](https://git-scm.com/))

### Installation

#### Method 1: Docker (Recommended for Quick Start)

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/starqi.git
cd starqi

# 2. Copy environment configuration
cp .env.example .env

# 3. Start all services
docker-compose up -d

# 4. Wait for services to initialize (30-60 seconds)
docker-compose logs -f

# 5. Access the application
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
```

#### Method 2: Manual Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/starqi.git
cd starqi

# 2. Install root dependencies
npm install

# 3. Install server dependencies
cd server
npm install
cd ..

# 4. Install client dependencies
cd client
npm install
cd ..

# 5. Setup MySQL database
mysql -u root -p < setup/database.sql

# 6. Configure environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env

# Edit the .env files with your configuration

# 7. Start development servers
npm run dev

# Backend will run on http://localhost:5000
# Frontend will run on http://localhost:5173
```

### Configuration

#### Server Configuration (server/.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=starqi_user
DB_PASSWORD=your_secure_password
DB_DATABASE=starqi

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg

# CORS
CORS_ORIGIN=http://localhost:5173

# Base URL
BASE_URL=http://localhost:5000
```

#### Client Configuration (client/.env)

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Optional: Map API Keys
VITE_MAPBOX_TOKEN=your_mapbox_token
```

---

## 💻 Usage

### Uploading a Sky Photo

1. **Navigate to Upload Page**
   - Go to http://localhost:5173/upload

2. **Capture Location**
   - Click "Use Current Location" for automatic GPS
   - Or manually enter latitude/longitude
   - Optionally add location name, city, and country

3. **Upload Photo**
   - Drag and drop a night sky photo
   - Or click to browse and select
   - Supported formats: JPEG, PNG
   - Max size: 10MB

4. **Analyze**
   - Click "Upload & Analyze"
   - Wait for processing (5-15 seconds)
   - View your results!

### Understanding Your Results

#### Light Pollution Level
- **Excellent** (Green): Pristine dark skies
- **Good** (Light Green): Minimal light pollution
- **Moderate** (Yellow): Some light pollution
- **Poor** (Orange): Significant light pollution
- **Very Poor** (Red): Severe light pollution

#### SQM Value (Sky Quality Meter)
- Measured in magnitudes per square arcsecond (mag/arcsec²)
- **21.7+**: Excellent dark-sky site
- **19-21**: Rural to suburban
- **<18**: Urban to city sky
- Higher values = darker skies

#### Bortle Scale
- Class 1-9 dark-sky classification
- Class 1: Excellent dark-sky site
- Class 4-5: Suburban sky
- Class 8-9: Inner-city sky

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

Most endpoints support optional authentication. Include JWT token in header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Endpoints

#### Authentication

**Register User**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "skyobserver",
  "password": "securepassword123",
  "full_name": "John Doe" // optional
}

Response: 201 Created
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "skyobserver",
    "full_name": "John Doe"
  }
}
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}

Response: 200 OK
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

**Get Profile**
```http
GET /api/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN

Response: 200 OK
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "skyobserver",
    "total_readings": 15,
    "total_contributions": 150
  }
}
```

#### Sky Readings

**Upload Photo**
```http
POST /api/readings/upload
Content-Type: multipart/form-data
Authorization: Bearer YOUR_JWT_TOKEN // optional

Form Data:
- photo: (binary file)
- latitude: 34.0522
- longitude: -118.2437
- location_name: "Griffith Observatory" // optional
- city: "Los Angeles" // optional
- country: "USA" // optional
- observation_datetime: "2025-01-15T22:30:00Z" // optional

Response: 201 Created
{
  "message": "Photo uploaded and analyzed successfully",
  "reading": {
    "id": "uuid",
    "sqm_value": 18.5,
    "bortle_scale": 7,
    "light_pollution_level": "poor",
    "star_count": 25,
    ...
  }
}
```

**Get Reading by ID**
```http
GET /api/readings/:id

Response: 200 OK
{
  "reading": {
    "id": "uuid",
    "sqm_value": 21.8,
    "bortle_scale": 1,
    "location_name": "Death Valley",
    "photo_upload": { ... },
    "user": { ... }
  }
}
```

**Get Readings (with filters)**
```http
GET /api/readings?country=USA&min_bortle=1&max_bortle=3&limit=20&offset=0

Response: 200 OK
{
  "readings": [ ... ],
  "pagination": {
    "total": 150,
    "limit": 20,
    "offset": 0
  }
}
```

**Get Map Data**
```http
GET /api/readings/map/data

Response: 200 OK
{
  "readings": [
    {
      "id": "uuid",
      "latitude": 34.0522,
      "longitude": -118.2437,
      "bortle_scale": 7,
      "sqm_value": 18.5,
      "light_pollution_level": "poor",
      "location_name": "Los Angeles"
    },
    ...
  ]
}
```

**Get Global Statistics**
```http
GET /api/readings/stats/global

Response: 200 OK
{
  "statistics": {
    "total_readings": 5000,
    "average_bortle": "5.2",
    "average_sqm": "19.8",
    "best_reading": { ... },
    "worst_reading": { ... },
    "top_countries": [
      { "country": "USA", "count": 1200, "avg_bortle": 5.5 },
      ...
    ]
  }
}
```

### Error Responses

```json
{
  "error": "Error message description",
  "details": "Optional detailed error information"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

---

## 🔬 Sky Quality Analysis

### Analysis Pipeline

The `SkyQualityAnalyzer` service processes each uploaded photo through multiple stages:

#### 1. Image Loading & Preprocessing
```typescript
- Load image with Sharp
- Extract dimensions and metadata
- Convert to raw pixel data
```

#### 2. Brightness Analysis
```typescript
calculateAverageBrightness()
- Analyze entire image luminance
- Use perceived brightness formula: 0.299*R + 0.587*G + 0.114*B
- Return average brightness (0-255)

calculateSkyRegionBrightness()
- Focus on top 70% of image (sky region)
- Exclude bottom 30% (horizon/ground)
- Calculate sky-specific brightness
```

#### 3. Star Detection
```typescript
estimateStarCount()
- Convert to grayscale
- Normalize contrast
- Apply brightness threshold (>200)
- Use flood-fill algorithm to detect connected bright regions
- Filter by size (2-50 pixels)
- Count valid star regions
```

#### 4. Light Pollution Signature Detection
```typescript
detectHorizonGlow()
- Compare bottom 20% brightness vs top 50%
- If bottom is 1.3x brighter → glow detected
- Indicates nearby urban light pollution
```

#### 5. Color Temperature Analysis
```typescript
estimateColorTemperature()
- Calculate average RGB values
- Compute blue/red ratio
- Map to Kelvin scale (2000-10000K)
- Warmer (orange) = more pollution
- Cooler (blue) = less pollution
```

#### 6. SQM Value Calculation
```typescript
brightnesseToSQM()
- Convert brightness to Sky Quality Meter value
- Use logarithmic scale
- Formula: SQM = 22 - log10(brightness/255 + 0.01) * 3
- Range: 10-22 mag/arcsec²
- Higher values = darker skies
```

#### 7. Bortle Scale Classification
```typescript
sqmToBortleScale()
SQM → Bortle Mapping:
- ≥21.7 → Class 1 (Excellent dark-sky)
- 21.5-21.7 → Class 2 (Truly dark)
- 21.3-21.5 → Class 3 (Rural)
- 20.4-21.3 → Class 4 (Rural/suburban)
- 19.1-20.4 → Class 5 (Suburban)
- 18.0-19.1 → Class 6 (Bright suburban)
- <18.0 → Class 7-9 (Urban/city)
```

#### 8. Overall Quality Assessment
```typescript
determineLightPollutionLevel()
Combines multiple factors:
- SQM value (primary indicator)
- Star count (visibility metric)
- Horizon glow (pollution signature)

Returns: excellent | good | moderate | poor | very_poor
```

### Algorithm Accuracy

The analysis algorithm provides:
- **High Accuracy**: For relative comparisons between locations
- **Good Correlation**: With professional SQM device readings (±0.5 mag/arcsec²)
- **Environmental Factors**: Weather, moon phase, camera settings affect results
- **Best Practices**: Use consistent camera settings, clear nights, avoid moon

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────────┐
│    users     │──────<│  sky_readings    │>──────│  photo_uploads   │
└──────────────┘  1:N  └──────────────────┘  1:1  └──────────────────┘
                              │ N:1
                              │
                              ▼
                       ┌──────────────┐
                       │  locations   │
                       └──────────────┘

┌──────────────┐       ┌──────────────────┐
│    users     │──────<│  contributions   │
└──────────────┘  1:N  └──────────────────┘

┌──────────────┐       ┌──────────────────┐
│    users     │──────<│  sqm_devices     │
└──────────────┘  1:N  └──────────────────┘
```

### Core Tables

See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for complete schema documentation.

**Key Entities:**
- `users` - User accounts and authentication
- `sky_readings` - All sky quality measurements
- `photo_uploads` - Photo metadata and analysis results
- `sqm_devices` - Registered hardware SQM devices
- `locations` - Pre-populated cities and regions
- `contributions` - User contribution tracking and gamification

---

## 🔧 Development

### Project Structure

```
starqi/
├── client/                      # React frontend
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── LightPollutionMap.tsx
│   │   │   ├── PhotoUpload.tsx
│   │   │   └── Layout.tsx
│   │   ├── pages/               # Page components
│   │   │   ├── HomePage.tsx
│   │   │   └── UploadPage.tsx
│   │   ├── services/            # API services
│   │   │   └── api.ts
│   │   ├── stores/              # State management
│   │   │   └── authStore.ts
│   │   ├── types/               # TypeScript types
│   │   │   └── index.ts
│   │   ├── App.tsx              # Main app component
│   │   ├── main.tsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── server/                      # Node.js backend
│   ├── src/
│   │   ├── config/              # Configuration
│   │   │   └── database.ts
│   │   ├── controllers/         # Request handlers
│   │   │   ├── authController.ts
│   │   │   └── readingsController.ts
│   │   ├── models/              # Database models
│   │   │   ├── User.ts
│   │   │   ├── SkyReading.ts
│   │   │   ├── PhotoUpload.ts
│   │   │   ├── SqmDevice.ts
│   │   │   ├── Location.ts
│   │   │   └── Contribution.ts
│   │   ├── routes/              # API routes
│   │   │   ├── authRoutes.ts
│   │   │   └── readingsRoutes.ts
│   │   ├── services/            # Business logic
│   │   │   ├── SkyQualityAnalyzer.ts
│   │   │   └── PhotoProcessingService.ts
│   │   ├── middleware/          # Express middleware
│   │   │   └── auth.ts
│   │   ├── utils/               # Utilities
│   │   │   ├── fileUpload.ts
│   │   │   └── jwt.ts
│   │   └── index.ts             # Entry point
│   ├── uploads/                 # Upload directory
│   ├── package.json
│   ├── tsconfig.json
│   ├── nodemon.json
│   ├── Dockerfile
│   └── .env.example
│
├── setup/                       # Setup scripts
│   ├── database.sql
│   └── deploy.sh
│
├── docs/                        # Documentation
│   ├── API.md
│   └── CONTRIBUTING.md
│
├── docker-compose.yml
├── .gitignore
├── .env.example
├── package.json
├── README.md
├── QUICKSTART.md
├── ROADMAP.md
└── DATABASE_SCHEMA.md
```

### Development Workflow

#### Running in Development Mode

```bash
# Start both frontend and backend
npm run dev

# Or start separately:
npm run dev:server  # Backend on :5000
npm run dev:client  # Frontend on :5173
```

#### Database Management

```bash
# Access MySQL (Docker)
docker exec -it starqi-db mysql -u starqi_user -p starqi

# Access MySQL (Manual)
mysql -u starqi_user -p starqi

# Common commands
SHOW TABLES;
DESCRIBE sky_readings;
SELECT COUNT(*) FROM sky_readings;
```

#### Viewing Logs

```bash
# Docker logs
docker-compose logs -f server
docker-compose logs -f client
docker-compose logs -f db

# Manual - check terminal output
```

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for React and Node.js
- **Prettier**: Consistent code formatting (recommended)
- **Naming Conventions**:
  - Components: PascalCase
  - Files: camelCase or PascalCase
  - Variables/Functions: camelCase
  - Constants: UPPER_SNAKE_CASE
  - Database: snake_case

---

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test

# E2E tests
npm run test:e2e
```

### Test Coverage

```bash
npm run test:coverage
```

### Manual Testing

1. **Photo Upload Flow**
   - Upload various image formats
   - Test with different locations
   - Verify analysis results

2. **Authentication**
   - Register new user
   - Login/logout
   - Protected routes

3. **Map Functionality**
   - View markers
   - Click popups
   - Filter readings

---

## 🚀 Deployment

See detailed deployment guides in `/setup/` directory:

- [deploy.sh](./setup/deploy.sh) - Automated deployment script
- [nginx.conf](./setup/nginx.conf) - Nginx configuration
- [pm2.config.js](./setup/pm2.config.js) - PM2 process configuration

### Quick Production Deployment

```bash
# Using deployment script
chmod +x setup/deploy.sh
./setup/deploy.sh production

# Or using Docker
docker-compose -f docker-compose.prod.yml up -d
```

### Deployment Checklist

- [ ] Set strong JWT_SECRET
- [ ] Configure database credentials
- [ ] Set up SSL/TLS certificates
- [ ] Configure domain and DNS
- [ ] Set up backup strategy
- [ ] Configure monitoring and logging
- [ ] Set up firewall rules
- [ ] Enable rate limiting
- [ ] Configure CDN for static assets
- [ ] Set up error tracking (Sentry)
- [ ] Configure analytics

---

## 🤝 Contributing

We welcome contributions from the community! See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for guidelines.

### Ways to Contribute

- 🐛 Report bugs
- 💡 Suggest features
- 📝 Improve documentation
- 🔧 Submit pull requests
- 🌍 Add translations
- 📊 Share data and readings

### Development Setup

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write/update tests
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

### Organizations
- **International Dark-Sky Association** - Light pollution awareness
- **Globe at Night** - Citizen science inspiration
- **Light Pollution Map** - Data visualization reference

### Technologies
- All open-source contributors
- React, Node.js, and TypeScript communities
- Leaflet mapping library
- Sharp image processing library

### Inspiration
- **aqi.in** - Air quality monitoring platform inspiration
- **Light Pollution Map** - Visualization concepts
- **Clear Dark Sky** - Mobile sky quality apps

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/starqi/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/starqi/discussions)
- **Email**: support@starqi.org
- **Twitter**: [@StarQI](https://twitter.com/starqi)

---

## 🌠 Project Status

- ✅ **Phase 1**: Core functionality (Photo upload, Analysis, Map) - **COMPLETE**
- 🚧 **Phase 2**: Enhanced features (Devices, API, Mobile) - **IN PROGRESS**
- 📋 **Phase 3**: Advanced features (ML, Social, Community) - **PLANNED**

See [ROADMAP.md](./ROADMAP.md) for detailed timeline and features.

---

<div align="center">

**StarQI** - Preserving our view of the stars, one measurement at a time.

Made with ❤️ by the StarQI Community

[⬆ Back to Top](#-starqi---light-pollution-portal)

</div>
