# Phúc GPT - AI Chat Assistant

## Tổng quan dự án
Ứng dụng chatbot AI với RAG (Retrieval Augmented Generation) sử dụng:
- **Frontend**: React + Vite
- **Backend**: Express.js + Node.js
- **Database**: AstraDB (vector database)
- **AI**: OpenAI GPT-4o-mini với embeddings
- **Web Scraping**: Puppeteer

## Tính năng chính
1. ✅ Giao diện chat hiện đại, responsive
2. ✅ Lưu lịch sử cuộc trò chuyện (conversation context)
3. ✅ RAG - Trả lời dựa trên dữ liệu từ database
4. ✅ Đăng nhập đơn giản (nhập tên)
5. 🔄 Tích hợp Google/GitHub OAuth (đang phát triển)

## Cấu trúc dự án
```
├── client/              # Frontend React
│   ├── src/
│   │   ├── pages/      # Login, Chat pages
│   │   ├── App.jsx     # Main app component
│   │   └── main.jsx    # Entry point
│   └── package.json
├── controllers/         # Backend controllers
│   └── chat.controller.js
├── routes/             # API routes
│   ├── chat.route.js
│   └── index.js
├── config/             # Database configuration
│   └── loadDb.js
├── index.js            # Backend server
└── start.sh            # Startup script
```

## Biến môi trường cần thiết
```
ASTRA_DB_ENDPOINT=your_endpoint
ASTRA_DB_APPLICATION_TOKEN=your_token
ASTRA_DB_COLLECTION=phucgpt
ASTRA_DB_NAMESPACE=default_keyspace
OPENAI_API_KEY=your_key
BACKEND_PORT=3000
```

## Cách chạy
- Frontend: Port 5000 (Vite dev server)
- Backend: Port 3000 (Express API)
- Script: `bash start.sh` chạy cả hai

## Lịch sử thay đổi

### 2025-10-27
- ✅ Tạo frontend React với Vite
- ✅ Thêm trang đăng nhập với UI đẹp
- ✅ Thêm trang chat với giao diện hiện đại
- ✅ Cập nhật backend hỗ trợ lưu lịch sử chat
- ✅ Tích hợp conversation context
- ✅ Cấu hình Puppeteer cho Replit environment
- ✅ Thêm nút Google/GitHub (placeholder)

## Kế hoạch phát triển

### Giai đoạn tiếp theo
1. Tích hợp Replit Auth cho Google/GitHub OAuth
   - Yêu cầu: PostgreSQL database
   - Sử dụng blueprint `javascript_log_in_with_replit`
2. Cải thiện UI/UX
3. Thêm tính năng xuất lịch sử chat
4. Tối ưu hóa performance

## Ghi chú kỹ thuật
- Frontend phải chạy trên port 5000 với `host: 0.0.0.0` và `allowedHosts: true`
- Backend chạy trên localhost:3000
- Vite proxy các request `/api` đến backend
- Conversation history lưu trong AstraDB collection `conversations`
- RAG sử dụng vector similarity search với embeddings

## User Preferences
- Ngôn ngữ: Tiếng Việt
- Framework ưa thích: React, Express.js
- Database: AstraDB (đã có sẵn)
