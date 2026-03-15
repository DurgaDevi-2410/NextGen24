from django.db import models

class Course(models.Model):
    title = models.CharField(max_length=200)
    duration = models.CharField(max_length=100)
    rating = models.IntegerField(default=5)
    image = models.ImageField(upload_to='courses/', null=True, blank=True)
    icon_color = models.CharField(max_length=20, default='#e31e24')
    icon_text = models.CharField(max_length=10, blank=True)
    mode_text = models.CharField(max_length=100, default='Online / Offline')
    placement_text = models.CharField(max_length=100, default='100% Placement Support')
    categories = models.TextField(help_text="Comma separated categories")
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=99.00)
    
    # Detailed Page Fields (JSON Strings or Text)
    objective = models.TextField(blank=True, default="To provide in-depth knowledge and practical skills.")
    topics = models.JSONField(default=list, blank=True) # Requires Django 3.0+ and supported DB (SQLite supports JSONField in recent versions, else TextField)
    scope = models.TextField(blank=True, default="High demand in the current market.")
    projects = models.JSONField(default=list, blank=True)

    def __str__(self):
        return self.title

class GalleryCategory(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    main_image = models.ImageField(upload_to='gallery/categories/', null=True, blank=True)
    
    def __str__(self):
        return self.name

class GalleryItem(models.Model):
    TYPE_CHOICES = (
        ('image', 'Image'),
        ('video', 'Video'),
    )
    category = models.ForeignKey(GalleryCategory, related_name='items', on_delete=models.CASCADE)
    item_type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='image')
    url = models.FileField(upload_to='gallery/items/')
    thumbnail = models.ImageField(upload_to='gallery/thumbs/', null=True, blank=True)
    title = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.title} ({self.item_type})"

class Trainer(models.Model):
    name = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    biography = models.TextField()
    image = models.ImageField(upload_to='trainers/')
    linkedin = models.URLField(blank=True)
    twitter = models.URLField(blank=True)
    github = models.URLField(blank=True)

    def __str__(self):
        return self.name

class Placement(models.Model):
    company_name = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    logo = models.ImageField(upload_to='placements/')

    def __str__(self):
        return self.company_name

class ContactMessage(models.Model):
    ENQUIRY_CHOICES = (
        ('admission', 'Admissions'),
        ('courses', 'Programs'),
        ('support', 'Student Support'),
    )
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone_number = models.CharField(max_length=20)
    enquiry_type = models.CharField(max_length=20, choices=ENQUIRY_CHOICES)
    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, default='New')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class ContactSetting(models.Model):
    address = models.TextField()
    primary_phone = models.CharField(max_length=20)
    official_email = models.EmailField()
    whatsapp = models.CharField(max_length=20)
    facebook = models.URLField(blank=True)
    twitter = models.URLField(blank=True)
    instagram = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)

    def __str__(self):
        return "Contact Settings"

class AboutContent(models.Model):
    section_name = models.CharField(max_length=100, unique=True) # e.g., 'hero', 'who-we-are', 'mission'
    data = models.JSONField() # Store structured JSON for each section

    def __str__(self):
        return self.section_name

class MediaAsset(models.Model):
    file = models.ImageField(upload_to='assets/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Asset {self.id}"

class Enrollment(models.Model):
    # 1. Personal Details
    full_name = models.CharField(max_length=200)
    birth_date = models.CharField(max_length=20, blank=True)
    gender = models.CharField(max_length=20)
    photo = models.ImageField(upload_to='enrollments/photos/', null=True, blank=True)

    # 2. Contact Details
    mobile_number = models.CharField(max_length=20)
    email = models.EmailField()
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=20)

    # 3. Education Details
    qualification = models.CharField(max_length=100)
    college_name = models.CharField(max_length=200)
    passing_year = models.CharField(max_length=10)
    percentage = models.CharField(max_length=20)

    # 4. Course Details
    selected_course = models.CharField(max_length=200)
    course_type = models.CharField(max_length=50) # Online/Offline
    batch_timing = models.CharField(max_length=50)
    
    # 5. Background Details
    experience_status = models.CharField(max_length=50) # Fresher/Experienced
    skills = models.TextField(blank=True)

    # 6. Payment Details
    payment_mode = models.CharField(max_length=50, default='UPI')
    transaction_id = models.CharField(max_length=100, blank=True)
    paid_amount = models.CharField(max_length=50, blank=True)

    # 7. Confirmation
    terms_accepted = models.BooleanField(default=False)
    declaration_accepted = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='Pending') # Pending, Approved, Rejected

    def __str__(self):
        return f"{self.full_name} - {self.selected_course}"
