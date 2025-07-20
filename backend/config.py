import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # API Keys
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    RAPIDAPI_KEY = os.getenv('RAPIDAPI_KEY')
    LIGHTCAST_API_KEY = os.getenv('LIGHTCAST_API_KEY')
    GLASSDOOR_API_KEY = os.getenv('GLASSDOOR_API_KEY')
    
    # Flask Config
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')
    DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
