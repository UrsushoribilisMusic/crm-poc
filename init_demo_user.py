import sqlite3

def migrate_and_init():
    conn = sqlite3.connect('data/crm.db')
    cursor = conn.cursor()
    
    # Ensure columns exist (Simple migration)
    try:
        cursor.execute('ALTER TABLE tasks ADD COLUMN assigned_to_id INTEGER')
    except sqlite3.OperationalError: pass # Already exists
    
    try:
        cursor.execute('ALTER TABLE activities ADD COLUMN user_id INTEGER')
    except sqlite3.OperationalError: pass # Already exists

    # Create Demo User
    cursor.execute('''
        INSERT OR IGNORE INTO users (full_name, email, role) 
        VALUES (?, ?, ?)
    ''', ('Demo User', 'demo@example.com', 'Admin'))
    conn.commit()
    
    # Get ID
    demo_id = cursor.execute('SELECT id FROM users WHERE email=?', ('demo@example.com',)).fetchone()[0]
    
    # Link all existing tasks and activities to this ID
    cursor.execute('UPDATE tasks SET assigned_to_id = ?', (demo_id,))
    cursor.execute('UPDATE activities SET user_id = ?', (demo_id,))
    
    conn.commit()
    conn.close()
    print(f"Migration complete: Demo User (ID {demo_id}) linked.")

if __name__ == "__main__":
    migrate_and_init()
