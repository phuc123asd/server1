from flask import session, request, jsonify, render_template
from app import app
from flask_login import login_required, current_user
from chat_service import chat_service
from db_service import save_chat_history, get_chat_history, get_db
import asyncio


# Make session permanent
@app.before_request
def make_session_permanent():
    session.permanent = True

# Serve React app for all frontend routes
@app.route('/')
@app.route('/<path:path>')
def serve_react(path=''):
    if path.startswith('api/') or path.startswith('auth/'):
        return jsonify({'error': 'Not found'}), 404
    
    try:
        return app.send_static_file('index.html')
    except:
        return jsonify({'error': 'Frontend not built. Run: cd client && npm run build'}), 500

# API: Get current user info
@app.route('/api/user')
def get_user():
    if current_user.is_authenticated:
        return jsonify({
            'id': current_user.id,
            'email': current_user.email,
            'first_name': current_user.first_name,
            'last_name': current_user.last_name,
            'profile_image_url': current_user.profile_image_url
        })
    return jsonify({'error': 'Not authenticated'}), 401

# API: Chat endpoint with RAG
@app.route('/api/chat', methods=['POST'])
@login_required
def chat():
    try:
        data = request.get_json()
        message = data.get('message')
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        reply = asyncio.run(chat_service.chat(message))
        
        save_chat_history(
            user_id=current_user.id,
            message=message,
            reply=reply
        )
        
        return jsonify({'reply': reply})
        
    except Exception as error:
        print(f'Chat error: {str(error)}')
        return jsonify({'error': str(error)}), 500


# API: Get chat history
@app.route('/api/chat/history', methods=['GET'])
@login_required
def get_chat_history_route():
    try:
        histories = get_chat_history(user_id=current_user.id, limit=50)
        return jsonify(histories)
        
    except Exception as error:
        return jsonify({'error': str(error)}), 500