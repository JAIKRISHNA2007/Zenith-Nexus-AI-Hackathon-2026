import { useState, useEffect } from "react";
import { Database, Upload, Check, RefreshCw, X, Table } from "lucide-react";
import { useChatStore } from "../../store/chatStore";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseConnectionModal = ({ isOpen, onClose }: Props) => {
  const {
    datasetInfo,
    datasetLoading,
    fetchDatasetStatus,
    connectSampleDatabase,
    uploadDatasetFile,
  } = useChatStore();

  const [activeTab, setActiveTab] = useState<"sample" | "upload">("sample");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchDatasetStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    await uploadDatasetFile(selectedFile);
    setSelectedFile(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-2.5 text-white shadow-md shadow-blue-500/20">
              <Database size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Database & Dataset Connection</h2>
              <p className="text-xs text-slate-500">Connect or switch the BI data source for AI analysis</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700">
            <X size={20} />
          </button>
        </div>

        {/* Current Active Info */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-3.5 border-b flex items-center justify-between">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-blue-700">Active BI Source</span>
            <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              {datasetInfo?.name || "Sample E-commerce Database"}
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                <Check size={12} /> Connected
              </span>
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Table size={13} /> {datasetInfo?.tables?.length || 0} Tables Available
            </span>
          </div>
        </div>

        <div className="flex border-b bg-slate-100/70 p-1.5 gap-2 px-6">
          <button
            onClick={() => setActiveTab("sample")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              activeTab === "sample" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:bg-slate-200/60"
            }`}
          >
            Sample E-commerce DB
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              activeTab === "upload" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:bg-slate-200/60"
            }`}
          >
            Upload CSV
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "sample" && (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Database size={32} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">E-Commerce BI Dataset</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Includes realistic tables (`customers`, `products`, `orders`, `order_items`, `inventory`) seeded with sales, customer spend, and inventory data.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={connectSampleDatabase}
                  disabled={datasetLoading}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 disabled:opacity-50"
                >
                  {datasetLoading && <RefreshCw size={16} className="animate-spin" />}
                  Use Sample E-Commerce Database
                </button>
              </div>
            </div>
          )}

          {activeTab === "upload" && (
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-8 text-center cursor-pointer hover:bg-slate-100/50 hover:border-blue-400 transition">
                <Upload size={36} className="text-slate-400 mb-2" />
                <span className="text-sm font-semibold text-slate-700">
                  {selectedFile ? selectedFile.name : "Choose or drop CSV dataset file"}
                </span>
                <span className="text-xs text-slate-400 mt-1">Supports .csv up to 50MB</span>
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              </label>

              {selectedFile && (
                <div className="flex justify-end">
                  <button
                    onClick={handleFileUpload}
                    disabled={datasetLoading}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {datasetLoading && <RefreshCw size={14} className="animate-spin" />}
                    Upload & Load Dataset
                  </button>
                </div>
              )}
            </div>
          )}



          {/* Tables Preview */}
          {datasetInfo?.tables && datasetInfo.tables.length > 0 && (
            <div className="mt-5 border-t pt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Available Tables in Active Dataset:</span>
              <div className="flex flex-wrap gap-2">
                {datasetInfo.tables.map((tbl) => (
                  <span key={tbl} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 border">
                    {tbl}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
