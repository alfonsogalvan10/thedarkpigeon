from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import uvicorn
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="The Dark Pigeon")

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

WEB3FORMS_KEY = os.getenv("WEB3FORMS_KEY", "75f623d1-ef7e-47ad-a073-f6667342012b")


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
    payload = {
        "access_key": WEB3FORMS_KEY,
        "name": name,
        "email": email,
        "company": company or "N/A",
        "message": message,
        "subject": f"New inquiry from {name} — The Dark Pigeon",
    }

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post("https://api.web3forms.com/submit", data=payload)
            result = resp.json()
            if result.get("success"):
                print(f"Email sent to hello@thedarkpigeon.com via Web3Forms")
            else:
                print(f"Web3Forms error: {result}")
    except Exception as e:
        print(f"Web3Forms request failed: {e}")

    return JSONResponse(
        {"status": "ok", "message": "Thank you. We'll be in touch within 24 hours."}
    )


if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
