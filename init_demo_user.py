import sqlite3
import os

def migrate_and_init():
    db_path = 'data/crm.db'
    if not os.path.exists('data'):
        os.makedirs('data')
        
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Simple migration for Phase 2
    try:
        cursor.execute('ALTER TABLE users ADD COLUMN google_token TEXT')
        print("Added google_token column to users table.")
    except sqlite3.OperationalError: 
        pass # Already exists

    try:
        cursor.execute('ALTER TABLE tasks ADD COLUMN assigned_to_id INTEGER')
    except sqlite3.OperationalError: pass
    
    try:
        cursor.execute('ALTER TABLE activities ADD COLUMN user_id INTEGER')
    except sqlite3.OperationalError: pass

    # Ensure users table exists (in case it's a fresh DB)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            role TEXT DEFAULT 'User',
            google_token TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Create Demo Users
    users_to_add = [
        ('Demo User', 'demo@example.com', 'Admin'),
        ('Gemini AI', 'gemini@example.com', 'User'),
        ('Claude AI', 'claude@example.com', 'User')
    ]
    
    for full_name, email, role in users_to_add:
        cursor.execute('''
            INSERT OR IGNORE INTO users (full_name, email, role) 
            VALUES (?, ?, ?)
        ''', (full_name, email, role))
    
    conn.commit()
    
    # Get Demo ID
    demo_id_row = cursor.execute('SELECT id FROM users WHERE email=?', ('demo@example.com',)).fetchone()
    if demo_id_row:
        demo_id = demo_id_row[0]
        # Link all existing tasks and activities to this ID
        cursor.execute('UPDATE tasks SET assigned_to_id = ? WHERE assigned_to_id IS NULL', (demo_id,))
        cursor.execute('UPDATE activities SET user_id = ? WHERE user_id IS NULL', (demo_id,))
    
    conn.commit()
    conn.close()
    print("Database initialization and migration complete.")

if __name__ == "__main__":
    migrate_and_init()
