from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import uvicorn

app = FastAPI(title="The Dark Pigeon")

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse(request, "index.html")


@app.post("/contact")
async def contact(
    name: str = Form(...),
    email: str = Form(...),
    company: str = Form(""),
    message: str = Form(...),
):
    # In production, wire this to an email service or DB
    return JSONResponse(
        {"status": "ok", "message": "Thank you. We'll be in touch within 24 hours."}
    )


if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
