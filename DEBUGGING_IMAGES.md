# About Us Image Debugging Guide

## Step-by-Step Debugging Process

### 1. Test Image Upload (Admin Panel)

1. Open your **Admin Panel** in browser (usually `http://localhost:5174`)
2. Open **Browser Console** (Press F12 → Console tab)
3. Go to **About Us** → **Who We Are** tab
4. Click **"Upload Image"** button
5. Select an image file from your computer

**Expected Console Output:**
```
Upload response: {
  id: 1,
  file: "http://localhost:8000/media/assets/yourimage.jpg",
  file_url: "http://localhost:8000/media/assets/yourimage.jpg",
  uploaded_at: "2026-01-17T..."
}
Image URL: http://localhost:8000/media/assets/yourimage.jpg
```

**Alert Message:**
```
Image uploaded successfully! URL: http://localhost:8000/media/assets/yourimage.jpg
```

6. Click **"Save"** button to save the data to database

---

### 2. Verify Database Storage

**Option A: Using Django Admin**
1. Go to `http://localhost:8000/admin/`
2. Login with superuser credentials
3. Go to **Api** → **About contents**
4. Find the entry with section_name = `who-we-are`
5. Check the `data` field - it should contain JSON like:
```json
{
  "subtitle": "WHO WE ARE",
  "heading": "Driven by <span class='highlight-maroon'>Purpose</span>",
  "description": "...",
  "images": ["http://localhost:8000/media/assets/yourimage.jpg"]
}
```

**Option B: Using API**
1. Open browser and go to: `http://localhost:8000/api/about-content/`
2. Look for the object with `"section_name": "who-we-are"`
3. Check the `data.images` array

---

### 3. Test Frontend Display

1. Open your **Frontend Website** (usually `http://localhost:5173`)
2. Open **Browser Console** (Press F12 → Console tab)
3. Navigate to **About Us** page

**Expected Console Output:**
```
About content API response: [
  {
    section_name: "who-we-are",
    data: {
      subtitle: "WHO WE ARE",
      heading: "Driven by <span class='highlight-maroon'>Purpose</span>",
      description: "...",
      images: ["http://localhost:8000/media/assets/yourimage.jpg"]
    }
  },
  ...
]

Parsed data map: {
  who-we-are: {
    subtitle: "WHO WE ARE",
    heading: "...",
    description: "...",
    images: ["http://localhost:8000/media/assets/yourimage.jpg"]
  }
}

Who We Are images: ["http://localhost:8000/media/assets/yourimage.jpg"]
```

4. Check the **Network tab** in browser console
5. Look for the image request to `http://localhost:8000/media/assets/yourimage.jpg`
6. Status should be **200 OK**

---

### 4. Common Issues & Solutions

#### Issue 1: Image shows alt text only
**Symptoms:** You see "Our Team" text instead of the image

**Causes:**
- Image URL is incorrect or incomplete
- Django media files not being served
- CORS blocking the image request

**Solutions:**
1. Check console for the exact image URL being used
2. Try opening the image URL directly in a new browser tab
3. If it shows 404, the file doesn't exist
4. If it shows CORS error, check Django CORS settings

#### Issue 2: Upload fails
**Symptoms:** Alert says "Failed to upload image"

**Solutions:**
1. Check console for error details
2. Verify Django server is running (`python manage.py runserver`)
3. Check if `media/assets/` folder exists in `e3backend/`
4. Check file permissions on the media folder

#### Issue 3: Image uploads but doesn't save
**Symptoms:** Image uploads successfully but doesn't appear after clicking Save

**Solutions:**
1. Check console for any errors during save
2. Verify the API endpoint `/api/about-content/` is working
3. Check if data is actually saved in database
4. Try refreshing the page after saving

#### Issue 4: Image URL is relative instead of absolute
**Symptoms:** Image URL is `/media/assets/image.jpg` instead of `http://localhost:8000/media/assets/image.jpg`

**Solutions:**
1. This is fixed in the latest code
2. The serializer should return absolute URLs
3. If still happening, restart Django server

---

### 5. Manual Test URLs

Test these URLs in your browser:

1. **API Endpoint:**
   ```
   http://localhost:8000/api/about-content/
   ```
   Should return JSON array of all sections

2. **Media Assets API:**
   ```
   http://localhost:8000/api/media-assets/
   ```
   Should return JSON array of all uploaded images

3. **Media Folder:**
   ```
   http://localhost:8000/media/assets/
   ```
   Should show directory listing or 404 (not 500 error)

4. **Specific Image:**
   ```
   http://localhost:8000/media/assets/yourimage.jpg
   ```
   Should display the image

---

### 6. Quick Fix Checklist

If images still don't show, verify:

- [ ] Django server is running on port 8000
- [ ] Frontend is running on port 5173
- [ ] Admin is running on port 5174
- [ ] `MEDIA_URL = '/media/'` in settings.py
- [ ] `MEDIA_ROOT = os.path.join(BASE_DIR, 'media')` in settings.py
- [ ] Media URL is added to urlpatterns in e3core/urls.py
- [ ] `CORS_ALLOW_ALL_ORIGINS = True` in settings.py
- [ ] The `media/assets/` folder exists in e3backend directory
- [ ] Uploaded images are actually in the `media/assets/` folder

---

### 7. Expected File Structure

```
e3backend/
├── media/
│   └── assets/
│       ├── yourimage1.jpg
│       ├── yourimage2.jpg
│       └── ...
├── api/
├── e3core/
└── manage.py
```

---

## Next Steps

1. Follow the debugging steps above
2. Note down any console errors or unexpected output
3. Check which step fails
4. Report back with the specific error message or console output
