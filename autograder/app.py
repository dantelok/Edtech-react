from src.models import google_multimodal_gemini
from fastapi import FastAPI, File, UploadFile
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


class UserInput(BaseModel):
    question: str


app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allows requests from this origin
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)


@app.get("/")
async def read_root():
    return {"Hello": "World"}


@app.post("/autograder")
async def autograde(file: UploadFile = File(...)):
    # Process the uploaded file (image)
    # You can access the file contents with file.file.read()

    contents = await file.read()  # Read the file's content
    response = google_multimodal_gemini(contents)

    return {"response": response, "message": "Grading completed successfully."}
