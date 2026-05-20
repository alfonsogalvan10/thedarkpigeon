from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import uvicorn
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="The Dark Pigeon")

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASS = os.getenv("SMTP_PASS", "")
NOTIFY_EMAIL = "hello@thedarkpigeon.com"


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
    body = (
        f"New inquiry from The Dark Pigeon website\n"
        f"{'='*45}\n\n"
        f"Name:    {name}\n"
        f"Email:   {email}\n"
        f"Company: {company or 'N/A'}\n\n"
        f"Message:\n{message}\n"
    )

    if SMTP_HOST and SMTP_USER:
        try:
            msg = MIMEMultipart()
            msg["From"] = SMTP_USER
            msg["To"] = NOTIFY_EMAIL
            msg["Reply-To"] = email
            msg["Subject"] = f"New inquiry from {name} — The Dark Pigeon"
            msg.attach(MIMEText(body, "plain"))

            with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
                server.login(SMTP_USER, SMTP_PASS)
                server.send_message(msg)
            print(f"Email sent successfully to {NOTIFY_EMAIL}")
        except Exception as e:
            print(f"Email send failed: {e}")
            print(f"--- Logged inquiry ---\n{body}")

    return JSONResponse(
        {"status": "ok", "message": "Thank you. We'll be in touch within 24 hours."}
    )


if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
