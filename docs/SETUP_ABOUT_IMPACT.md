# 🚀 Setup Guide - About Page & Impact Dashboard

This guide will help you set up and deploy the new About page and Impact Dashboard features.

---

## ✅ What Was Built

### Backend:
1. **New Database Table**: `impact_metrics` - stores manual metrics (schools, workshops, students)
2. **New Model**: `ImpactMetric.ts` - TypeORM entity
3. **New Controller**: `statsController.ts` - API endpoints for impact data
4. **New Routes**: `statsRoutes.ts` - `/api/stats/*` endpoints
5. **Updated**: `database.ts`, `index.ts` - integrated new entity and routes

### Frontend:
1. **New Page**: `AboutPage.tsx` - Your story, mission, impact
2. **New Page**: `ImpactPage.tsx` - Comprehensive impact dashboard with charts
3. **Updated**: `api.ts` - added stats API methods
4. **Updated**: `App.tsx` - added routes for /about and /impact
5. **Updated**: `Layout.tsx` - added navigation links

---

## 📋 Step-by-Step Setup

### Step 1: Database Setup

Run the migration to create the `impact_metrics` table:

```bash
# Navigate to server directory
cd server

# If using MySQL command line:
mysql -u root -p starqi < src/migrations/003_impact_metrics.sql

# Or if using a GUI tool (MySQL Workbench, phpMyAdmin):
# 1. Open the tool
# 2. Select 'starqi' database
# 3. Copy and paste content from src/migrations/003_impact_metrics.sql
# 4. Execute
```

**What this creates**:
- Table `impact_metrics` with columns: id, metric_name, metric_value, description, last_updated
- Initial rows for: schools_partnered, workshops_conducted, students_engaged, media_mentions
- All initialized to 0

**Verify**:
```sql
SELECT * FROM impact_metrics;
```

You should see 4 rows with all values at 0.

---

### Step 2: Install Dependencies (if needed)

The frontend uses Recharts for graphs. It should already be in package.json, but verify:

```bash
cd client

# Check if recharts is installed
npm list recharts

# If not found, install it:
npm install recharts
```

---

### Step 3: Start the Backend

```bash
cd server

# Install dependencies (if you haven't already)
npm install

# Start the server
npm run dev
```

**Expected output**:
```
✅ Database connection established successfully

╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🌌 StarQI - Light Pollution Portal API                 ║
║                                                           ║
║   Server running on: http://localhost:5000                ║
║   ...                                                      ║
║   - Stats: http://localhost:5000/api/stats                ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

**Test the API**:
```bash
# Test quick stats endpoint
curl http://localhost:5000/api/stats/quick

# Should return:
# {"totalUsers":0,"totalReadings":0,"countries":0}

# Test full impact metrics
curl http://localhost:5000/api/stats/impact
```

---

### Step 4: Start the Frontend

```bash
cd client

# Install dependencies (if you haven't already)
npm install

# Start the development server
npm run dev
```

**Expected output**:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

### Step 5: Test the New Pages

Open your browser and visit:

1. **About Page**: http://localhost:5173/about
   - Should show your story with live metrics
   - Should have 3 metric cards (Users, Readings, Countries)
   - Should have sections: Story, How it Works, Get Involved

2. **Impact Dashboard**: http://localhost:5173/impact
   - Should show comprehensive metrics
   - Should have charts for growth over time
   - Should show geographic distribution
   - Charts might be empty if you have no data yet

3. **Navigation**: Check that "About" and "Impact" links appear in the header navigation

---

## 🎨 Customization Guide

### Update Your Story (Required!)

Edit `client/src/pages/AboutPage.tsx`:

**Line 54-60**: Update the quote with YOUR story
```typescript
"I've been fascinated by the night sky for as long as I can remember. But over
the years in Gurgaon, I watched the stars disappear one by one..."
```

**Line 123-130**: Update "About the Founder" section
```typescript
<strong>StarQI</strong> was founded by [YOUR NAME], a Class 11 student at Amity
International School Sector 46, Gurgaon...
```

**Line 137-142**: Add your contact links
```typescript
<a href="https://github.com/YOUR_USERNAME/starqi" ...>
<a href="mailto:YOUR_EMAIL@example.com" ...>
```

---

### Update Manual Metrics

As you achieve milestones, update the manual metrics in the database:

**Method 1: Using API** (recommended)
```bash
# Update schools partnered
curl -X PUT http://localhost:5000/api/stats/manual/schools_partnered \
  -H "Content-Type: application/json" \
  -d '{"value": 5, "updatedBy": "Your Name"}'

# Update workshops conducted
curl -X PUT http://localhost:5000/api/stats/manual/workshops_conducted \
  -H "Content-Type: application/json" \
  -d '{"value": 3, "updatedBy": "Your Name"}'

# Update students engaged
curl -X PUT http://localhost:5000/api/stats/manual/students_engaged \
  -H "Content-Type: application/json" \
  -d '{"value": 150, "updatedBy": "Your Name"}'

# Update media mentions
curl -X PUT http://localhost:5000/api/stats/manual/media_mentions \
  -H "Content-Type: application/json" \
  -d '{"value": 2, "updatedBy": "Your Name"}'
```

**Method 2: Direct Database Update**
```sql
-- Update schools
UPDATE impact_metrics
SET metric_value = 5
WHERE metric_name = 'schools_partnered';

-- Update workshops
UPDATE impact_metrics
SET metric_value = 3
WHERE metric_name = 'workshops_conducted';

-- Update students
UPDATE impact_metrics
SET metric_value = 150
WHERE metric_name = 'students_engaged';

-- Update media
UPDATE impact_metrics
SET metric_value = 2
WHERE metric_name = 'media_mentions';
```

**Best Practice**: Create a simple admin panel later, but for now, use the API or database directly.

---

## 📸 Add Your Photo

Replace the placeholder circle with your photo:

1. Add your photo to `client/public/images/` folder (create if it doesn't exist)
2. Name it `founder.jpg` or `profile.jpg`
3. Update `AboutPage.tsx` line 29:

```typescript
<img
  src="/images/founder.jpg"  // Update this path
  alt="Your Name"
  className="w-40 h-40 rounded-full mx-auto mb-8 object-cover border-4 border-indigo-200"
/>
```

Or keep the gradient circle (looks clean and professional!)

---

## 🎯 Testing Checklist

Before deploying, test these scenarios:

### About Page:
- [ ] Page loads without errors
- [ ] Metrics display (even if 0)
- [ ] All sections render correctly
- [ ] Links work (Get Involved CTAs)
- [ ] Responsive on mobile (test by resizing browser)
- [ ] Story text is YOUR story (not placeholder)

### Impact Dashboard:
- [ ] Page loads without errors
- [ ] All metric cards show numbers
- [ ] Charts render (even if empty)
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] "Upload Your Reading" button works

### Navigation:
- [ ] "About" link appears in nav
- [ ] "Impact" link appears in nav
- [ ] Links work from all pages
- [ ] Footer links work
- [ ] Mobile menu works (if you have one)

---

## 🚀 Deployment

### Production Build:

**Backend**:
```bash
cd server
npm run build
npm start
```

**Frontend**:
```bash
cd client
npm run build

# The build output will be in client/dist/
# Deploy this folder to your hosting service (Vercel, Netlify, etc.)
```

### Environment Variables:

Make sure your production `.env` has:
```
# Backend
DB_HOST=your-prod-database-host
DB_USERNAME=your-prod-db-username
DB_PASSWORD=your-prod-db-password
DB_DATABASE=starqi

# Frontend
VITE_API_URL=https://your-api-domain.com/api
```

---

## 📊 Monitoring Impact

### Weekly Tasks:
1. Check `/api/stats/impact` to see current numbers
2. Update manual metrics as you achieve milestones
3. Take screenshots for documentation
4. Track growth trends

### Monthly Tasks:
1. Generate impact report (from dashboard)
2. Update About page if major milestones
3. Add new achievements to story
4. Share stats on social media

---

## 🐛 Troubleshooting

### Issue: "Cannot GET /api/stats/impact"

**Solution**:
1. Check server is running
2. Verify `statsRoutes.ts` is imported in `index.ts`
3. Check database connection
4. Look for errors in server console

### Issue: "Failed to fetch impact metrics"

**Solution**:
1. Open browser console (F12)
2. Check Network tab for errors
3. Verify API_BASE_URL in `client/src/services/api.ts`
4. Check CORS settings in backend

### Issue: Charts not displaying

**Solution**:
1. Verify recharts is installed: `npm list recharts`
2. Check browser console for errors
3. Ensure data is being returned from API
4. Try adding some readings to have data to display

### Issue: Metrics show 0 even though you have users/readings

**Solution**:
1. Check database has data:
   ```sql
   SELECT COUNT(*) FROM users;
   SELECT COUNT(*) FROM sky_readings;
   ```
2. Verify API endpoint returns data (use curl or browser)
3. Check frontend is calling correct endpoint
4. Look for errors in browser console

---

## 🎨 Styling Customization

The pages use TailwindCSS. To customize colors:

### Change primary color from indigo to your choice:

Find and replace in `AboutPage.tsx` and `ImpactPage.tsx`:
- `indigo-600` → `yourcolor-600`
- `indigo-50` → `yourcolor-50`
- etc.

### Available Tailwind colors:
- slate, gray, zinc, neutral, stone
- red, orange, amber, yellow, lime
- green, emerald, teal, cyan, sky
- blue, indigo, violet, purple, fuchsia
- pink, rose

---

## 📝 Next Steps

After setting up About and Impact pages:

1. ✅ Customize the About page with YOUR story
2. ✅ Add your photo (optional)
3. ✅ Test both pages thoroughly
4. ✅ Update manual metrics as you achieve them
5. ✅ Share the About page link in your emails/outreach
6. ✅ Use Impact dashboard to track progress
7. ✅ Take screenshots for college applications

**Then move on to**:
- Blog/Learn section (educational content)
- School registration system
- Leaderboards and badges

---

## 💡 Tips for Success

1. **Update regularly**: Keep metrics current (weekly)
2. **Be authentic**: Your story in About page should be genuine
3. **Document everything**: Screenshot impact dashboard monthly
4. **Share links**: Include About page URL in all outreach
5. **Track growth**: Watch numbers grow over time
6. **Celebrate milestones**: Update when you hit big numbers

---

## 🆘 Need Help?

If you encounter issues:

1. Check browser console (F12) for errors
2. Check server console for backend errors
3. Verify database has impact_metrics table
4. Test API endpoints with curl
5. Review this guide step-by-step

Common fixes:
- `npm install` in both client and server
- `flutter clean` if needed
- Restart both servers
- Clear browser cache

---

## ✅ Success!

You now have:
- ✅ Professional About page telling your story
- ✅ Impact dashboard with real-time metrics
- ✅ API to track and update progress
- ✅ Foundation for college applications
- ✅ Links in navigation and footer

**Next**: Follow `INDIA_ACTION_PLAN.md` to start building community impact!

---

**Great work! Your platform now has a face and measurable impact tracking.** 🚀🌟
