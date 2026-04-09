# XanhSM Food AI Chatbot

AI-powered chatbot cho ứng dụng XanhSM Food — tư vấn menu, allergen, gợi ý món theo sở thích.

## Cấu trúc dự án

```
xanhsm-chatbot/
├── apps/frontend/        # Next.js 14 (UX/UI Team)
├── services/ai-agent/    # LangGraph AI Agent (Agent Team)
├── services/tools/       # Tool functions (Tools Team)
├── services/evaluation/  # Eval & logging (Eval Team)
├── packages/shared/      # Shared TypeScript types — KHÔNG tự sửa
├── data/mock/            # Mock data JSON (Data Team)
└── docs/                 # Flowcharts, API contract
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
