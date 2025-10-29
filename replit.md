# Football GPT - AI Chat Assistant

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

## Biến môi trường cần thiết

### Bắt buộc (Auto-configured)
- DATABASE_URL - PostgreSQL connection (✅ Auto)
- SESSION_SECRET - Flask session secret (✅ Auto)
- REPL_ID - Replit ID for auth (✅ Auto)


## Lịch sử thay đổi

### 2025-10-29 - Major Migration
- ✅ Migrated backend từ NodeJS sang Python/Flask
- ✅ Thêm Replit Auth với đa nền tảng login
- ✅ Redesign UI với Tailwind CSS
- ✅ Tích hợp PostgreSQL cho user data
- ✅ Build production-ready

## User Preferences
- Ngôn ngữ: Tiếng Việt
- Framework: Python/Flask + React
- Styling: Tailwind CSS
