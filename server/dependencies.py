
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth as admin_auth

bearer_scheme = HTTPBearer()


# dependencies for the current user
# extracts and verifies token from Firebase ID
# returns verification
async def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(bearer_scheme)
):
    try:
        decoded = admin_auth.verify_id_token(creds.credentials)
        return decoded
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired"
                            "authentication token")
