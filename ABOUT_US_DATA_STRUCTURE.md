# About Us Data Structure Guide

This document explains the exact data structure expected by the About Us page.

## API Endpoint
`GET http://localhost:8000/api/about-content/`

## Expected Response Format

The API returns an array of section objects. Each section has:
- `section_name`: string (unique identifier)
- `data`: JSON object (section-specific content)

## Section Data Structures

### 1. Hero Section
**section_name**: `"hero"`

```json
{
  "section_name": "hero",
  "data": {
    "heading": "Keeps Going And<br /><span style='color: #d11e1e'>Going And Going</span>",
    "quote": "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.",
    "author": "Albert Schweitzer",
    "carouselImages": [
      "http://localhost:8000/media/assets/image1.jpg",
      "http://localhost:8000/media/assets/image2.jpg",
      "http://localhost:8000/media/assets/image3.jpg"
    ]
  }
}
```

### 2. Who We Are Section
**section_name**: `"who-we-are"`

```json
{
  "section_name": "who-we-are",
  "data": {
    "subtitle": "WHO WE ARE",
    "heading": "Driven by <span class='highlight-maroon'>Purpose</span>",
    "description": "We are a team of visionaries dedicated to redefining standards. Our journey is fueled by passion and a relentless pursuit of excellence. Every project is a canvas, and we paint it with innovation.",
    "images": [
      "http://localhost:8000/media/assets/team_image.jpg"
    ]
  }
}
```

### 3. Stats Section
**section_name**: `"stats"`

```json
{
  "section_name": "stats",
  "data": {
    "heading": "Number that<br />Guarantee Success",
    "description": "The success of an influencer marketing campaign ultimately depends on the brand's specific goals and how well the campaign aligns with those goals",
    "stats": [
      {
        "id": 1,
        "label": "Influencers<br />from<br />Instagram",
        "value": "120M+",
        "iconColor": "#E1306C"
      },
      {
        "id": 2,
        "label": "Creators<br />on<br />our database",
        "value": "380M+",
        "iconColor": "#D32F2F"
      },
      {
        "id": 3,
        "label": "Influencers<br />from<br />YouTube",
        "value": "100M+",
        "iconColor": "#FF0000"
      }
    ]
  }
}
```

### 4. Mission Section
**section_name**: `"mission"`

```json
{
  "section_name": "mission",
  "data": {
    "subtitle": "OUR MISSION",
    "heading": "Crafting the <span class='highlight-maroon'>Future</span>",
    "description": "We don't just follow trends; we set them. Our mission is to empower businesses with tools that stand the test of time. Join us in building a legacy of quality and integrity.",
    "image": "http://localhost:8000/media/assets/mission_image.jpg"
  }
}
```

## How Images Work

1. **Upload**: When you upload an image in the admin panel, it's sent to `/api/media-assets/`
2. **Storage**: Django saves it to `e3backend/media/assets/`
3. **URL**: The API returns the full URL like `http://localhost:8000/media/assets/filename.jpg`
4. **Display**: The frontend uses this URL directly in `<img src={url} />`

## Troubleshooting

### Images Not Showing?

1. **Check the API response**:
   - Open browser console
   - Go to Network tab
   - Look for the request to `/api/about-content/`
   - Verify the image URLs are complete (starting with `http://`)

2. **Check Django media serving**:
   - Visit `http://localhost:8000/media/assets/` in your browser
   - You should see a directory listing or 404 (not a 500 error)

3. **Check the uploaded files**:
   - Look in `e3backend/media/assets/` folder
   - Verify your uploaded images are there

4. **Check CORS**:
   - The backend should allow requests from `http://localhost:5173` (or your frontend port)
   - Check `e3backend/e3core/settings.py` has `CORS_ALLOW_ALL_ORIGINS = True`

## Testing the Flow

1. **Admin Panel** (`http://localhost:5174` or your admin port):
   - Go to About Us → Who We Are
   - Click "Upload Image"
   - Select a file from your computer
   - You should see "Image uploaded successfully!"
   - Click "Save"

2. **Check Database**:
   - The data is saved to MySQL `e3campus_db` → `api_aboutcontent` table
   - The `data` column contains JSON with the image URL

3. **Frontend** (`http://localhost:5173` or your frontend port):
   - Navigate to About Us page
   - The image should load from the URL stored in the database
   - If it doesn't, check browser console for errors
