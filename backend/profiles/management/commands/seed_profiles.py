import random
import requests
from io import BytesIO
from django.core.management.base import BaseCommand
from django.core.files import File
from django.utils import timezone
from accounts.models import User
from profiles.models import IndividualProfile, Photo
from datetime import date, timedelta

class Command(BaseCommand):
    help = 'Seed 50 dummy profiles with photos'

    def handle(self, *args, **kwargs):
        # Sample data pools
        first_names_m = ['Arun', 'Bala', 'Chandru', 'Deepak', 'Ezhil', 'Ganesh', 'Hari', 'Karthik', 'Mani', 'Naveen',
                         'Praveen', 'Ramesh', 'Sathish', 'Vijay', 'Yogesh', 'Ajith', 'Dinesh', 'Kumar', 'Suresh', 'Ravi']
        first_names_f = ['Anitha', 'Bhavani', 'Chitra', 'Divya', 'Eswari', 'Gayathri', 'Hema', 'Janani', 'Kavya', 'Lakshmi',
                         'Meena', 'Nithya', 'Priya', 'Rekha', 'Sangeetha', 'Vani', 'Yamini', 'Aishwarya', 'Deepa', 'Shalini']
        cities = ['Chennai', 'Coimbatore', 'Madurai', 'Bangalore', 'Hyderabad', 'Trichy', 'Salem', 'Tirunelveli', 'Vellore', 'Erode',
                  'Singapore', 'Kuala Lumpur', 'London', 'New York', 'Toronto', 'Sydney', 'Dubai', 'Doha', 'Colombo', 'Paris']
        states = ['Tamil Nadu', 'Karnataka', 'Telangana', 'Maharashtra', 'Delhi', 'Kerala', '', '', '', '']
        countries = ['India', 'India', 'India', 'India', 'India', 'India', 'Singapore', 'Malaysia', 'UK', 'USA',
                     'Canada', 'Australia', 'UAE', 'Qatar', 'Sri Lanka', 'France', 'Germany', 'Netherlands', 'Switzerland', 'New Zealand']
        educations = ['B.E. Computer Science', 'B.Tech IT', 'MBA', 'M.Sc Mathematics', 'B.Com', 'B.A. English', 'M.E. ECE', 'MBBS', 'CA', 'PhD Physics',
                      'Diploma in Mechanical', 'B.Sc Nursing', 'B.Ed', 'M.Tech Software', 'B.Arch', 'LLB', 'B.Pharm', 'M.Com', 'BBA', 'M.Des']
        professions = ['Software Engineer', 'Doctor', 'Teacher', 'Accountant', 'Business Analyst', 'Designer', 'Architect', 'Lawyer', 'Pharmacist',
                       'Data Scientist', 'Product Manager', 'Consultant', 'Entrepreneur', 'Civil Engineer', 'Marketing Manager', 'Professor',
                       'HR Manager', 'Financial Analyst', 'Graphic Designer', 'Researcher']
        diets = ['vegetarian', 'non_vegetarian', 'eggetarian', 'vegan']
        spirituals = ['temple_going', 'spiritual_not_religious', 'cultural_only', 'atheist']
        family_involvements = ['high', 'moderate', 'low']
        relocations = ['within_tn', 'within_india', 'abroad', 'flexible']
        marital_options = ['never_married', 'never_married', 'never_married', 'divorced', 'widowed']
        castes = ['Brahmin', 'Chettiar', 'Gounder', 'Nadar', 'Vanniyar', 'Iyer', 'Iyengar', 'Mudaliar', 'Pillai', 'Thevar',
                  'Christian', 'Muslim', 'Scheduled Caste', 'Scheduled Tribe', 'Other', '', '', '', '', '']
        gothrams = ['Kashyapa', 'Bharadwaja', 'Vasistha', 'Viswamitra', 'Atreya', 'Gautama', 'Jamadagni', 'Agastya', 'Angirasa', 'Kausika',
                    'Harita', 'Mudgala', 'Sandilya', 'Kutsa', 'Vadhula', '', '', '', '', '']
        natchathirams = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha',
                         'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha']
        rasis = ['Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya', 'Tula', 'Vrischika', 'Dhanu', 'Makara',
                 'Kumbha', 'Meena', '', '', '', '', '', '', '', '']

        # Delete existing dummy users (optional; be careful)
        # We'll delete users with phone startswith '99999' to avoid duplicates
        User.objects.filter(phone__startswith='99999').delete()
        IndividualProfile.objects.filter(user__phone__startswith='99999').delete()
        Photo.objects.filter(profile__user__phone__startswith='99999').delete()

        for i in range(50):
            gender = random.choice(['male', 'female'])
            if gender == 'male':
                first_name = random.choice(first_names_m)
            else:
                first_name = random.choice(first_names_f)
            full_name = f'{first_name} {random.choice(["Kumar", "Sundar", "Rajan", "Krishnan", "Murugan", "Iyer", "Pillai", "Nair", "Menon", "Reddy"])}'
            phone = f'99999{i:05d}'[-10:]  # ensure 10 digits
            phone = f'99999{i:05d}'[-10:] if len(f'99999{i:05d}') == 10 else f'99999{i:05d}'
            # Create user
            user = User.objects.create_user(phone=phone, password='testpass123', role='individual')
            # Random date of birth (age between 20 and 38)
            age = random.randint(20, 38)
            dob = date.today() - timedelta(days=age*365 + random.randint(0, 364))
            city = random.choice(cities)
            state = random.choice(states) if city in ['Chennai','Coimbatore','Madurai','Trichy','Salem','Tirunelveli','Vellore','Erode'] else ''
            country = random.choice(countries)
            profile = IndividualProfile.objects.create(
                user=user,
                full_name=full_name,
                gender=gender,
                date_of_birth=dob,
                height_cm=random.randint(150, 190),
                marital_status=random.choice(marital_options),
                education=random.choice(educations),
                profession=random.choice(professions),
                income_range=random.choice(['0-3 LPA', '3-6 LPA', '6-10 LPA', '10-15 LPA', '15-25 LPA', '25+ LPA']),
                location_city=city,
                location_state=state,
                location_country=country,
                about_me=f'Hi, I am {full_name}. I enjoy music, travel, and family time.',
                tamil_language_importance=random.choice(['very', 'somewhat', 'not']),
                festivals=random.sample(['Pongal', 'Deepavali', 'Tamil New Year'], random.randint(1,3)),
                spiritual_orientation=random.choice(spirituals),
                diet=random.choice(diets),
                family_involvement=random.choice(family_involvements),
                relocation_willingness=random.choice(relocations),
                caste=random.choice(castes),
                subcaste=random.choice(['', 'Iyer', 'Iyengar', 'Kongu', 'Nattu', '']),
                gothram=random.choice(gothrams),
                natchathiram=random.choice(natchathirams),
                rasi=random.choice(rasis),
                last_active=timezone.now() - timedelta(days=random.randint(0, 30)),
            )
            # Download random portrait
            try:
                if gender == 'male':
                    img_url = f'https://randomuser.me/api/portraits/men/{random.randint(0,99)}.jpg'
                else:
                    img_url = f'https://randomuser.me/api/portraits/women/{random.randint(0,99)}.jpg'
                response = requests.get(img_url)
                if response.status_code == 200:
                    photo_file = BytesIO(response.content)
                    photo = Photo(profile=profile)
                    photo.image.save(f'seed_{phone}.jpg', File(photo_file), save=False)
                    photo.save()
                    # generate blurred? no, but we can set blurred_image = image for now
                    photo.blurred_image = photo.image
                    photo.save(update_fields=['blurred_image'])
            except Exception as e:
                self.stdout.write(self.style.WARNING(f'Could not download photo for {full_name}: {e}'))

        self.stdout.write(self.style.SUCCESS('Successfully seeded 50 dummy profiles'))