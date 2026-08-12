import os
import csv
import io
import sqlite3
import uuid
from typing import Dict, Any, Optional
from pathlib import Path
from sqlalchemy import create_engine, inspect, Engine

from backend.app.services.bi_seed import seed_ecommerce_db, ECOMMERCE_DB_PATH

BASE_DIR = Path(__file__).resolve().parents[2]
UPLOADS_DIR = BASE_DIR / "database" / "uploads"


class BIManager:
    _instance: Optional["BIManager"] = None

    def __init__(self):
        # Ensure sample database exists
        seed_ecommerce_db()
        self.active_db_name = "Sample E-commerce Database"
        db_path = Path(ECOMMERCE_DB_PATH).as_posix()
        self.active_db_url = f"sqlite:///{db_path}"
        self.engine: Engine = create_engine(self.active_db_url, echo=False)

    @classmethod
    def get_instance(cls) -> "BIManager":
        if cls._instance is None:
            cls._instance = BIManager()
        return cls._instance

    def get_engine(self) -> Engine:
        return self.engine

    def get_active_info(self) -> Dict[str, Any]:
        return {
            "name": self.active_db_name,
            "url": self.active_db_url,
            "tables": self.get_schema_tables(),
        }

    def set_sample_database(self) -> Dict[str, Any]:
        if hasattr(self, "engine") and self.engine:
            self.engine.dispose()
        seed_ecommerce_db()
        self.active_db_name = "Sample E-commerce Database"
        db_path = Path(ECOMMERCE_DB_PATH).as_posix()
        self.active_db_url = f"sqlite:///{db_path}"
        self.engine = create_engine(self.active_db_url, echo=False)
        return self.get_active_info()

    def load_dataset_file(self, file_bytes: bytes, filename: str) -> Dict[str, Any]:
        """
        Parses uploaded CSV/Excel file, creates an SQLite DB table,
        and switches active BI dataset to this file.
        """
        if not os.path.exists(UPLOADS_DIR):
            os.makedirs(UPLOADS_DIR, exist_ok=True)

        clean_name = os.path.splitext(filename)[0].lower()
        table_name = "".join(c if c.isalnum() else "_" for c in clean_name).strip("_") or "uploaded_data"
        
        # Use a unique identifier for the file so we don't try to overwrite an active SQLite DB
        unique_id = uuid.uuid4().hex[:8]
        db_file_path = UPLOADS_DIR / f"{table_name}_{unique_id}.db"

        # Remove existing if present (though it won't be with the UUID, safe practice)
        if os.path.exists(db_file_path):
            os.remove(db_file_path)

        conn = sqlite3.connect(str(db_file_path))
        cursor = conn.cursor()

        if filename.lower().endswith(".xlsx") or filename.lower().endswith(".xls"):
            raise ValueError("Excel (.xlsx) files are not currently supported by the lightweight parser. Please save your file as a .csv and upload again!")

        # Try multiple encodings, especially for Excel-exported CSVs (utf-16)
        try:
            content_str = file_bytes.decode("utf-8")
        except UnicodeDecodeError:
            try:
                content_str = file_bytes.decode("utf-16")
            except UnicodeDecodeError:
                content_str = file_bytes.decode("latin-1", errors="ignore")
                
        # Remove any lingering null bytes that crash csv.reader
        content_str = content_str.replace('\x00', '')
        
        csv_reader = csv.reader(io.StringIO(content_str))
        
        headers = next(csv_reader, None)
        if not headers:
            conn.close()
            raise ValueError("Uploaded file is empty or invalid format")

        clean_headers = ["".join(c if c.isalnum() else "_" for c in h).strip("_") or f"col_{i}" for i, h in enumerate(headers)]

        # Create table dynamically
        cols_def = ", ".join([f'"{h}" TEXT' for h in clean_headers])
        cursor.execute(f'CREATE TABLE "{table_name}" ({cols_def});')

        # Insert rows
        placeholders = ", ".join(["?"] * len(clean_headers))
        rows = [row for row in csv_reader if row]
        if rows:
            cursor.executemany(f'INSERT INTO "{table_name}" VALUES ({placeholders})', rows)

        conn.commit()
        conn.close()

        if hasattr(self, "engine") and self.engine:
            self.engine.dispose()

        self.active_db_name = f"Uploaded Dataset: {filename}"
        posix_db_path = db_file_path.as_posix()
        self.active_db_url = f"sqlite:///{posix_db_path}"
        self.engine = create_engine(self.active_db_url, echo=False)

        return self.get_active_info()

    def get_schema_tables(self) -> list:
        try:
            inspector = inspect(self.engine)
            tables = inspector.get_table_names()
            return tables if tables else []
        except Exception as e:
            print(f"Error inspecting schema tables: {e}")
            return []


bi_manager = BIManager.get_instance()
