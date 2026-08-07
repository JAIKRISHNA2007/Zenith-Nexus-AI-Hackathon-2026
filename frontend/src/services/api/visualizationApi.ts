import apiClient from "./client";

export interface VisualizationRequestPayload {
  chart_type: string;
  rows: Array<Record<string, unknown>>;
  config: {
    title?: string;
    xAxis?: string | null;
    yAxis?: string | null;
    category?: string | null;
    value?: string | null;
  };
}

export interface VisualizationResponse {
  chartType: string;
  title: string;
  xAxis?: string | null;
  yAxis?: string | null;
  category?: string | null;
  value?: string | null;
  data: Array<Record<string, unknown>>;
}

export const generateVisualizationApi = async (
  payload: VisualizationRequestPayload,
): Promise<VisualizationResponse> => {
  const response = await apiClient.post<VisualizationResponse>(
    "/api/v1/visualization",
    payload,
  );
  return response.data;
};
