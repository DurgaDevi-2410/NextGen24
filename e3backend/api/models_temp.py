from django.db import models

class Enrollment(models.Model):
    # 1. Personal Details
    full_name = models.CharField(max_length=200)
    birth_date = models.CharField(max_length=20, blank=True) # Keeping as CharField for simplicity with frontend date format
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
