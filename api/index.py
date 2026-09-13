import sys
import os
from pathlib import Path

# Add project root and backend folder to system path for Vercel serverless function execution
root_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root_dir))
sys.path.insert(0, str(root_dir / "backend"))

from backend.main import app

# Export FastAPI app for Vercel serverless handler
app = app
