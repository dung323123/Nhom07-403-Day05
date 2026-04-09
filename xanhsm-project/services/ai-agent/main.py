from fastapi import FastAPI
from api.routes.chat import router as chat_router

app = FastAPI(title="XanhSM AI Agent", version="0.1.0")
app.include_router(chat_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
