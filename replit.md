# Phúc GPT - AI Chat Assistant

## Tổng quan dự án
Ứng dụng chatbot AI với RAG (Retrieval Augmented Generation) - **Migrated to Python**

### Tech Stack
- **Backend**: Python + Flask
- **Frontend**: React + Vite + Tailwind CSS
- **Database**: PostgreSQL (Replit) + AstraDB (vector database)
- **Authentication**: Replit Auth (Google, GitHub, X, Apple, Email)
- **AI**: OpenAI GPT-4 với embeddings
- **Web Scraping**: Playwright + BeautifulSoup

## Tính năng chính
1. ✅ Đăng nhập đa nền tảng (Google, GitHub, X, Apple, Email)
2. ✅ Giao diện hiện đại với Tailwind CSS
3. ✅ RAG - Trả lời dựa trên dữ liệu từ vector database
4. ✅ Lưu lịch sử chat vào PostgreSQL
5. ✅ Responsive design

## Cấu trúc dự án

### Backend (Python)
```
├── app.py              # Flask app initialization
├── main.py             # Entry point
├── models.py           # Database models (User, OAuth, ChatHistory)
├── replit_auth.py      # Authentication logic
├── routes.py           # API routes
├── chat_service.py     # RAG chat service
└── templates/          # HTML templates
    └── 403.html        # Error page
```

### Frontend (React)
```
└── client/
    ├── src/
    │   ├── pages/
    │   │   ├── LandingPage.jsx   # Landing page (logged out)
    │   │   └── ChatPage.jsx       # Chat interface (logged in)
    │   ├── App.jsx                # Main app with routing
    │   └── index.css              # Tailwind CSS
    └── dist/                      # Built static files
```

## Biến môi trường cần thiết

### Bắt buộc (Auto-configured)
- `DATABASE_URL` - PostgreSQL connection (✅ Auto)
- `SESSION_SECRET` - Flask session secret (✅ Auto)
- `REPL_ID` - Replit ID for auth (✅ Auto)

### Cần cấu hình thủ công
```bash
# OpenAI API (Required for chat)
OPENAI_API_KEY=sk-...

# AstraDB (Required for RAG)
ASTRA_DB_ENDPOINT=https://....apps.astra.datastax.com
ASTRA_DB_APPLICATION_TOKEN=AstraCS:...
ASTRA_DB_COLLECTION=phucgpt
```

## Cách sử dụng

### 1. Cấu hình API Keys
Thêm các biến môi trường cần thiết vào Secrets:
- `OPENAI_API_KEY`
- `ASTRA_DB_ENDPOINT`
- `ASTRA_DB_APPLICATION_TOKEN`

### 2. Chạy ứng dụng
App tự động chạy trên port 5000. Truy cập webview để sử dụng.

### 3. Đăng nhập
Nhấn "Đăng nhập để bắt đầu" và chọn phương thức đăng nhập:
- Google
- GitHub  
- X (Twitter)
- Apple
- Email/Password

### 4. Chat với AI
Sau khi đăng nhập, bạn có thể bắt đầu chat với Phúc GPT!

## API Endpoints

### Authentication
- `GET /auth/login` - Bắt đầu đăng nhập
- `GET /auth/logout` - Đăng xuất

### API Routes
- `GET /api/user` - Lấy thông tin user hiện tại
- `POST /api/chat` - Gửi tin nhắn (requires auth)
  - Body: `{"message": "câu hỏi của bạn"}`
  - Response: `{"reply": "câu trả lời từ AI"}`
- `GET /api/chat/history` - Lấy lịch sử chat (requires auth)

## Database Models

### User
- `id` (String, PK) - User ID from auth provider
- `email` (String, unique)
- `first_name`, `last_name` (String)
- `profile_image_url` (String)
- `created_at`, `updated_at` (DateTime)

### ChatHistory
- `id` (Integer, PK)
- `user_id` (String, FK → User)
- `message` (Text) - User message
- `reply` (Text) - AI reply
- `created_at` (DateTime)

### OAuth
- Required by Replit Auth for session management

## Lịch sử thay đổi

### 2025-10-29 - Major Migration
- ✅ Migrated backend từ NodeJS sang Python/Flask
- ✅ Thêm Replit Auth với đa nền tảng login
- ✅ Redesign UI với Tailwind CSS
- ✅ Tích hợp PostgreSQL cho user data
- ✅ Cải thiện error handling
- ✅ Build production-ready với Vite

### 2025-10-27 (Previous)
- ✅ Tạo frontend React với Vite
- ✅ NodeJS backend với Express
- ✅ RAG với AstraDB

## Kế hoạch phát triển

### Giai đoạn tiếp theo
1. Thêm streaming responses
2. Multi-conversation support
3. Export chat history
4. Admin dashboard
5. Rate limiting
6. Caching layer

## Ghi chú kỹ thuật

### Frontend
- Vite dev server: port 3000 (không dùng trong production)
- Production: Static files được serve bởi Flask từ `client/dist`
- Tailwind CSS cho styling
- React Router cho routing

### Backend
- Flask chạy trên port 5000 (bắt buộc cho Replit webview)
- Serve static files từ `client/dist`
- CORS enabled cho development
- Session-based authentication
- ProxyFix middleware cho HTTPS

### Security
- Session secret auto-generated
- CSRF protection via Flask session
- OAuth tokens stored securely in database
- Password hashing (nếu dùng email/password)

### Performance
- Database connection pooling
- Static file caching
- Async RAG processing

## Troubleshooting

### Frontend không load
```bash
cd client && npm run build
```

### Database errors
Kiểm tra DATABASE_URL có đúng không:
```bash
echo $DATABASE_URL
```

### Chat không hoạt động
Đảm bảo đã cấu hình:
1. OPENAI_API_KEY
2. ASTRA_DB_ENDPOINT
3. ASTRA_DB_APPLICATION_TOKEN

### Auth redirect issues
Replit Auth tự động cấu hình redirect URLs. Không cần setup thêm.

## User Preferences
- Ngôn ngữ: Tiếng Việt
- Framework: Python/Flask + React
- Styling: Tailwind CSS
- Database: PostgreSQL + AstraDB
