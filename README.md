# XanhSM Food AI Chatbot

AI-powered chatbot cho ứng dụng XanhSM Food — tư vấn menu, allergen, gợi ý món theo sở thích.

## Cấu trúc dự án

```
/
├── frontend/                     # Next.js 16 (UX/UI Team)
│   ├── src/
│   │   ├── app/                  # App Router pages
│   │   ├── components/           # React components
│   │   ├── data/                 # Frontend mock data
│   │   ├── lib/                  # Utilities
│   │   └── types/                # Frontend-specific types
│   └── public/                   # Static assets
├── backend/
│   ├── services/
│   │   ├── ai-agent/             # LangGraph AI Agent (Agent Team)
│   │   └── evaluation/           # Eval & logging (Eval Team)
│   └── data/
│       └── mock/                 # Mock data JSON (Data Team)
├── packages/shared/              # Shared TypeScript types — KHÔNG tự sửa
├── docs/                         # Flowcharts, API contract
└── docker-compose.yml
```

## Khởi động local

```bash
docker-compose up --build
```

## API Endpoints chính

| Endpoint | Service | Mô tả |
|---|---|---|
| `POST /api/chat` | ai-agent | Gửi câu hỏi → nhận ChatResponse |
| `POST /eval/log` | evaluation | Ghi EvalLog |
| `POST /eval/outcome` | evaluation | Ghi kết quả conversion/ignored |
| `POST /eval/correction` | evaluation | Ghi báo sai → alert merchant |

## Quy tắc Git

- Không push thẳng lên `main` hoặc `develop`
- `packages/shared/` → cần PR + 1 reviewer approve
- Mock Data Team phải done `data/mock/` trước Tuần 1
