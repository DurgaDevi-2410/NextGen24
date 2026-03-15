# Placement Save Issue - Debugging Guide

## How to Debug Placement Save Issue

### Step 1: Open Admin Panel
1. Go to `http://localhost:5174` (or your admin port)
2. Navigate to **Placements** section
3. Open **Browser Console** (Press F12 → Console tab)

### Step 2: Try to Add a Placement
1. Click **"Add New Placement"** button
2. Fill in the form:
   - **Company Name:** (e.g., "Google")
   - **Role:** (e.g., "Software Engineer")
   - **Upload Logo:** Click and select an image file

3. Click **"Add Placement"** button

### Step 3: Check Console Output

**If successful, you'll see:**
```
Form data: {name: "Google", role: "Software Engineer", logo: File, logoPreview: "blob:..."}
Sending placement data to backend...
Company Name: Google
Role: Software Engineer
Logo: File {name: "google.png", ...}
Placement saved successfully: {id: 1, company_name: "Google", role: "Software Engineer", logo: "/media/placements/google.png"}
```

**Alert:** "Placement added successfully!"

**If it fails, you'll see:**
```
Form data: {...}
Sending placement data to backend...
Error saving placement: Error: ...
Error response: {...}
Error status: 400 (or 500)
```

**Alert:** "Failed to save placement: [error message]"

### Step 4: Common Issues & Solutions

#### Issue 1: "Please fill in all fields and upload a logo"
**Cause:** One or more fields are empty
**Solution:** Make sure all three fields are filled:
- Company Name ✓
- Role ✓
- Logo image uploaded ✓

#### Issue 2: Error 400 - Bad Request
**Possible causes:**
- Field names don't match backend model
- Image file is too large
- Invalid file format

**Solution:**
1. Check console for exact error message
2. Try with a smaller image (< 2MB)
3. Use common formats: JPG, PNG, WEBP

#### Issue 3: Error 500 - Server Error
**Possible causes:**
- Django server crashed
- Database connection issue
- Media folder permissions

**Solution:**
1. Check Django terminal for error messages
2. Verify `media/placements/` folder exists
3. Restart Django server:
   ```
   Ctrl+C
   python manage.py runserver
   ```

#### Issue 4: Error 403 - Forbidden
**Cause:** CORS or authentication issue

**Solution:**
1. Check `e3backend/e3core/settings.py`
2. Verify `CORS_ALLOW_ALL_ORIGINS = True`
3. Restart Django server

#### Issue 5: No error but placement doesn't appear
**Cause:** Frontend not refreshing

**Solution:**
1. Check if `fetchPlacements()` is called after save
2. Manually refresh the page
3. Check database to see if it was actually saved

### Step 5: Verify in Database

**Option A: Django Admin**
1. Go to `http://localhost:8000/admin/`
2. Login with superuser
3. Go to **Api** → **Placements**
4. Check if your placement is there

**Option B: API Endpoint**
1. Go to `http://localhost:8000/api/placements/`
2. You should see JSON array of all placements
3. Look for your newly added placement

### Step 6: Check File Upload

1. Navigate to `e3backend/media/placements/`
2. Check if the logo image file is there
3. If not, there's a file upload issue

### Step 7: Test Frontend Display

1. Go to frontend: `http://localhost:5173`
2. Navigate to Placements section
3. Your new placement should appear in the arc layout
4. If not, check browser console for errors

## What to Report

If the issue persists, please provide:

1. **Console output** from Step 3 (copy all messages)
2. **Django terminal output** (any error messages)
3. **Error alert message** (exact text)
4. **Browser** and version you're using
5. **Screenshot** of the form before clicking Add

## Quick Fix Checklist

- [ ] Django server is running
- [ ] Admin panel is running
- [ ] All form fields are filled
- [ ] Image file is selected
- [ ] Image is < 5MB
- [ ] Image is JPG/PNG/WEBP format
- [ ] `media/placements/` folder exists
- [ ] CORS is enabled in settings.py
- [ ] Browser console is open to see errors

## Expected Behavior

1. Fill form → Click Add
2. See console logs
3. See success alert
4. Form closes automatically
5. New placement appears in the list
6. Visit frontend → placement appears in arc layout
