import os
import json
import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

from ..database import get_db
from ..models import User, Task, Customer

router = APIRouter(tags=["google-calendar"])

# ALLOW HTTP FOR LOCAL DEVELOPMENT (REQUIRED BY OAUTHLIB)
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

# OAuth2 Scopes
SCOPES = ['https://www.googleapis.com/auth/calendar.events']
CLIENT_SECRETS_FILE = "credentials.json"

@router.get("/google-auth/{user_id}")
async def google_auth(user_id: int, request: Request):
    if not os.path.exists(CLIENT_SECRETS_FILE):
         raise HTTPException(status_code=500, detail="credentials.json missing on server.")
    
    flow = Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE,
        scopes=SCOPES,
        redirect_uri="http://localhost:8000/google-auth-callback"
    )
    
    authorization_url, _ = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true'
    )
    
    # Store user_id AND code_verifier in state to retrieve them in callback
    state = json.dumps({
        "user_id": user_id,
        "code_verifier": flow.code_verifier
    })
    
    # Re-generate URL with the state containing the verifier
    authorization_url, _ = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true',
        state=state
    )
    
    return {"url": authorization_url}

@router.get("/google-auth-callback")
async def google_auth_callback(request: Request, db: Session = Depends(get_db)):
    try:
        state_str = request.query_params.get('state')
        code = request.query_params.get('code')
        
        if not state_str or not code:
            raise HTTPException(status_code=400, detail="State or code missing")
        
        state = json.loads(state_str)
        user_id = state.get("user_id")
        code_verifier = state.get("code_verifier")
        
        flow = Flow.from_client_secrets_file(
            CLIENT_SECRETS_FILE,
            scopes=SCOPES,
            redirect_uri="http://localhost:8000/google-auth-callback"
        )
        
        # Use the verifier we saved in the state
        flow.fetch_token(code=code, code_verifier=code_verifier)
        credentials = flow.credentials
        
        # Save credentials to user record
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            print(f"ERROR: User {user_id} not found in database during callback")
            raise HTTPException(status_code=404, detail="User not found")
        
        token_data = {
            'token': credentials.token,
            'refresh_token': credentials.refresh_token,
            'token_uri': credentials.token_uri,
            'client_id': credentials.client_id,
            'client_secret': credentials.client_secret,
            'scopes': credentials.scopes
        }
        
        user.google_token = json.dumps(token_data)
        db.commit()
        
        print(f"SUCCESS: Tokens saved for user {user_id}")
        
        # Redirect back to frontend
        return RedirectResponse(url="http://localhost:5173/?auth=success")
    except Exception as e:
        print(f"FATAL ERROR in callback: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/sync-calendar/{user_id}")
async def sync_calendar(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.google_token:
        if os.environ.get("DEMO_MODE") == "true":
             return {"status": "success", "message": "Demo Mode: Syncing..."}
        raise HTTPException(status_code=400, detail="User not authenticated with Google")

    token_data = json.loads(user.google_token)
    creds = Credentials.from_authorized_user_info(token_data, SCOPES)
    
    try:
        service = build('calendar', 'v3', credentials=creds)
        
        # Get pending tasks for this user
        tasks = db.query(Task).filter(Task.assigned_to_id == user_id, Task.status != "Closed").all()
        print(f"DEBUG: Found {len(tasks)} tasks to sync for user {user_id}")
        
        synced_count = 0
        for task in tasks:
            if not task.due_date:
                continue
                
            customer = db.query(Customer).filter(Customer.id == task.customer_id).first()
            summary = f"CRM: {task.description}"
            if customer:
                summary += f" ({customer.first_name} {customer.last_name})"
            
            # Create Google Calendar Event
            start_time = task.due_date.isoformat()
            # Default 3 hours duration for better visibility
            end_time = (task.due_date + datetime.timedelta(hours=3)).isoformat()
            
            event = {
                'summary': summary,
                'description': f"CRM Task Category: {task.category}",
                'start': {'dateTime': start_time, 'timeZone': 'UTC'},
                'end': {'dateTime': end_time, 'timeZone': 'UTC'},
            }
            
            print(f"DEBUG: Syncing task '{summary}' for {start_time}")
            service.events().insert(calendarId='primary', body=event).execute()
            synced_count += 1
            
        return {"status": "success", "synced_count": synced_count}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Google Calendar API Error: {str(e)}")
