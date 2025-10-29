# API Routes
from flask import session, request, jsonify, render_template
from app import app, db
from replit_auth import require_login, make_replit_blueprint
from flask_login import current_user
from chat_service import chat_service
from models import ChatHistory
import asyncio

# Register Replit Auth blueprint
app.register_blueprint(make_replit_blueprint(), url_prefix="/auth")

# Make session permanent
@app.before_request
def make_session_permanent():
    session.permanent = True

# Serve React app for all frontend routes
@app.route('/')
@app.route('/<path:path>')
def serve_react(path=''):
    # For API calls, don't serve React
    if path.startswith('api/') or path.startswith('auth/'):
        return jsonify({'error': 'Not found'}), 404
    
    # Serve React app
    return app.send_static_file('index.html') if app.static_folder else render_template('index.html')

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
@require_login
def chat():
    try:
        data = request.get_json()
        message = data.get('message')
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Get response from chat service (RAG)
        reply = asyncio.run(chat_service.chat(message))
        
        # Save to database
        chat_history = ChatHistory()
        chat_history.user_id = current_user.id
        chat_history.message = message
        chat_history.reply = reply
        db.session.add(chat_history)
        db.session.commit()
        
        return jsonify({'reply': reply})
        
    except Exception as error:
        print(f'Chat error: {str(error)}')
        return jsonify({'error': str(error)}), 500

# API: Get chat history
@app.route('/api/chat/history', methods=['GET'])
@require_login
def get_chat_history():
    try:
        histories = ChatHistory.query.filter_by(
            user_id=current_user.id
        ).order_by(ChatHistory.created_at.desc()).limit(50).all()
        
        return jsonify([{
            'id': h.id,
            'message': h.message,
            'reply': h.reply,
            'created_at': h.created_at.isoformat()
        } for h in histories])
        
    except Exception as error:
        return jsonify({'error': str(error)}), 500
