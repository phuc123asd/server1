# Phúc GPT - AI Chat Assistant

Ứng dụng chatbot AI thông minh sử dụng RAG (Retrieval Augmented Generation).

## ✨ Tính năng

- 🤖 **AI Chatbot thông minh** - Sử dụng OpenAI GPT-4o-mini
- 💬 **Lưu lịch sử chat** - Conversation context được lưu trong AstraDB
- 🔍 **RAG** - Trả lời dựa trên dữ liệu từ vector database
- 🎨 **Giao diện đẹp** - UI hiện đại, responsive
- 👤 **Đăng nhập đơn giản** - Nhập tên để bắt đầu
- 🔐 **Google/GitHub OAuth** - Đang phát triển (buttons có sẵn)

## 🚀 Cài đặt

### Yêu cầu
- Node.js 20+
- AstraDB account
- OpenAI API key

### Cài đặt dependencies

```bash
# Backend
npm install --legacy-peer-deps

# Frontend
cd client
npm install --legacy-peer-deps
```

### Cấu hình biến môi trường

Tạo file `.env` từ `.env.example`:

```env
ASTRA_DB_ENDPOINT=your_endpoint
ASTRA_DB_APPLICATION_TOKEN=your_token
ASTRA_DB_COLLECTION=phucgpt
ASTRA_DB_NAMESPACE=default_keyspace
OPENAI_API_KEY=your_key
BACKEND_PORT=3000
```

### Chạy ứng dụng

```bash
bash start.sh
```

- Frontend: http://localhost:5000
- Backend API: http://localhost:3000

## 📁 Cấu trúc

```
├── client/              # React frontend (Vite)
│   ├── src/
│   │   ├── pages/      # Login & Chat pages
│   │   └── App.jsx
│   └── vite.config.js
├── controllers/         # Express controllers
├── routes/             # API routes
├── config/             # Database config
└── index.js            # Backend server
```

## 🔧 API Endpoints

- `POST /api/chat` - Gửi tin nhắn chat
- `GET /api/history/:conversationId` - Lấy lịch sử chat

## 📝 Ghi chú

- Conversation history tự động load khi reload trang
- Mỗi user có conversation ID riêng
- Tất cả tin nhắn đều có timestamp
- Frontend proxy `/api` requests đến backend

## 🛣️ Roadmap

- [ ] Tích hợp Replit Auth (Google/GitHub OAuth)
- [ ] Export lịch sử chat
- [ ] Tối ưu performance
- [ ] Thêm streaming responses

## 📄 License

MIT
