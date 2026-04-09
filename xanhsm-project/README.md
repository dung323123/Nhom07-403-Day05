# XanhSM Food AI Chatbot

AI-powered chatbot cho ứng dụng XanhSM Food — tư vấn menu, allergen, gợi ý món theo sở thích.

## Quickstart (Local — không dùng Docker)

### Yêu cầu

- **Node.js** 18+ và **npm**
- **Python** 3.10+ (khuyến nghị dùng conda env)
- **OpenAI API Key**

### 1. Clone và cài đặt

```bash
git clone https://github.com/dung323123/Nhom07-403-Day05.git
cd Nhom07-403-Day05/xanhsm-project
```

### 2. Tạo file `.env`

Tạo file `services/.env` với nội dung:

```env
OPENAI_API_KEY=sk-proj-...
```

Sao chép vào thư mục ai-agent:

```bash
cp services/.env services/ai-agent/.env
```

### 3. Khởi động AI Agent (port 8000)

```bash
cd services/ai-agent
pip install -r requirements.txt
python main.py
```

> Nếu dùng conda: `conda activate <env> && python main.py`

### 4. Khởi động Evaluation Service (port 8002)

Mở terminal mới:

```bash
cd services/evaluation
pip install -r requirements.txt
python main.py
```

### 5. Khởi động Frontend (port 3000)

Mở terminal mới:

```bash
cd app
npm install
npm run dev
```

### 6. Mở trình duyệt

Truy cập: **http://localhost:3000**

Các trang chính:
- `/` — Trang chủ, danh sách quán
- `/store/M001` — Quán Phở Gia Truyền Thìn
- `/store/M002` — Cơm Tấm Bụi Sài Gòn
- `/store/M003` — Mì Cay Sasin 7 Cấp Độ
- `/cart` — Giỏ hàng
- `/search` — Tìm kiếm quán

### 7. Test chat AI

Vào bất kỳ trang quán nào → nhấn **"Mở chat với quán"** → gửi câu hỏi về menu.

---

## Khởi động bằng Docker

```bash
docker-compose up --build
```

---

## Cấu trúc dự án

```
xanhsm-project/
├── app/                  # Next.js 16 frontend
│   └── src/
│       ├── app/          # Pages (home, store, cart, search, checkout)
│       ├── components/   # UI components (chat widget, cards, header)
│       ├── data/         # Mock JSON (stores, menu_items, categories)
│       └── store/        # Zustand state (cart, merchant auth)
├── services/
│   ├── ai-agent/         # LangGraph AI Agent — FastAPI port 8000
│   ├── evaluation/       # Eval & logging — FastAPI port 8002
│   └── .env              # API keys (KHÔNG commit)
├── packages/shared/      # Shared TypeScript types — KHÔNG tự sửa
├── data/mock/            # Mock data JSON
└── docs/                 # API contract, demo guides
```

## API Endpoints chính

| Endpoint | Service | Mô tả |
|---|---|---|
| `POST /chat` | ai-agent :8000 | Gửi câu hỏi → nhận ChatResponse |
| `POST /eval/log` | evaluation :8002 | Ghi EvalLog |
| `POST /eval/outcome` | evaluation :8002 | Ghi kết quả conversion/ignored |
| `POST /eval/correction` | evaluation :8002 | Ghi báo sai → alert merchant |

## Quy tắc Git

- Không push thẳng lên `main` hoặc `develop`
- `packages/shared/` → cần PR + 1 reviewer approve
- Mock Data Team phải done `data/mock/` trước Tuần 1
