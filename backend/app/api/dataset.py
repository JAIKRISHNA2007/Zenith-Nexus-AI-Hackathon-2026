from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from typing import Optional
from pydantic import BaseModel

from backend.app.services.bi_manager import bi_manager

router = APIRouter(prefix="/dataset", tags=["dataset"])



@router.get("/status")
def get_dataset_status():
    """
    Returns current active BI dataset information.
    """
    return bi_manager.get_active_info()


@router.post("/connect-sample")
def connect_sample_database():
    """
    Switch active BI database to Sample E-commerce dataset.
    """
    info = bi_manager.set_sample_database()
    return {
        "status": "success",
        "message": "Connected to Sample E-commerce Database",
        "dataset": info,
    }



@router.post("/upload")
async def upload_dataset_file(file: UploadFile = File(...)):
    """
    Upload CSV or Excel dataset file and set as active BI database.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    ext = file.filename.split(".")[-1].lower()
    if ext not in ["csv", "txt", "xlsx", "xls"]:
        raise HTTPException(status_code=400, detail="Supported file formats: .csv, .xlsx, .xls")

    try:
        contents = await file.read()
        info = bi_manager.load_dataset_file(contents, file.filename)
        return {
            "status": "success",
            "message": f"Dataset '{file.filename}' uploaded and loaded successfully",
            "dataset": info,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to load dataset file: {str(e)}")
