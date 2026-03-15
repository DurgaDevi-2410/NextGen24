
import os
import django
import random
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'e3core.settings')
django.setup()

from api.models import GalleryCategory, GalleryItem
from django.core.files.base import ContentFile

def create_dummy_image(text, color, width=800, height=600):
    image = Image.new('RGB', (width, height), color=color)
    draw = ImageDraw.Draw(image)
    
    # Try to center text
    try:
        # Use a basic font if possible, or default
        font = ImageFont.load_default()
        # Scale isn't easy with default font, but it's something
    except:
        font = None
    
    # Draw text multiple times to make it visible or just a cross
    draw.text((width/2 - 50, height/2), text, fill=(255, 255, 255))
    
    # Return as ContentFile
    img_io = BytesIO()
    image.save(img_io, format='JPEG', quality=70)
    return ContentFile(img_io.getvalue(), name=f"{text.replace(' ', '_')}.jpg")

def seed_gallery():
    print("Seeding gallery data with generated images...")

    categories_data = [
        {"name": "Campus Events", "color": "#e31e24", "desc": "Fun events"},
        {"name": "Workshops", "color": "#1e2ae3", "desc": "Technical learning"},
        {"name": "Student Life", "color": "#2ae31e", "desc": "Daily vibes"}
    ]

    for cat_data in categories_data:
        name = cat_data["name"]
        if GalleryCategory.objects.filter(name=name).exists():
            print(f"Category '{name}' already exists.")
            category = GalleryCategory.objects.get(name=name)
        else:
            print(f"Creating category: {name}")
            category = GalleryCategory(
                name=name,
                description=cat_data["desc"]
            )
            # Generate image
            img_file = create_dummy_image(name, cat_data["color"])
            category.main_image.save(f"cat_{name}.jpg", img_file, save=True)

        if category.items.count() == 0:
            print(f"Adding items to {name}...")
            for i in range(1, 4):
                title = f"{name} Item {i}"
                item = GalleryItem(
                    category=category,
                    title=title,
                    item_type='image'
                )
                img_file = create_dummy_image(title, cat_data["color"])
                item.url.save(f"item_{name}_{i}.jpg", img_file, save=True)
                print(f" - Added item: {title}")

    print("Gallery seeding complete.")

if __name__ == '__main__':
    seed_gallery()
