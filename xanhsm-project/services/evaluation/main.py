from fastapi import FastAPI
from api.routes.eval import router as eval_router

app = FastAPI(title="XanhSM Evaluation Service", version="0.1.0")
app.include_router(eval_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)
