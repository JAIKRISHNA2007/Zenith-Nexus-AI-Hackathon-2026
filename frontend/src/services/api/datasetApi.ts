import client from "./client";

export interface DatasetInfo {
  name: string;
  url: string;
  tables: string[];
}

export interface DatasetResponse {
  status: string;
  message: string;
  dataset: DatasetInfo;
}

export const getDatasetStatusApi = async (): Promise<DatasetInfo> => {
  const response = await client.get("/dataset/status");
  return response.data;
};

export const connectSampleDatabaseApi = async (): Promise<DatasetResponse> => {
  const response = await client.post("/dataset/connect-sample");
  return response.data;
};


export const uploadDatasetFileApi = async (file: File): Promise<DatasetResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await client.post("/dataset/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
