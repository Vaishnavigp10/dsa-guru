from .base import *
import dj_database_url

DEBUG = False

ALLOWED_HOSTS = ['*']  # Update with your Render domain after deploy

# Database
DATABASES = {
    'default': dj_database_url.config(
        default=os.getenv('DATABASE_URL'),
        conn_max_age=600,
    )
}

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')

STORAGES = {
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

# CORS - update with your Vercel domain
CORS_ALLOWED_ORIGINS = [
    "https://dsa-guru.vercel.app",  # Your actual Vercel URL
    "http://localhost:5173",
]

# Security
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True