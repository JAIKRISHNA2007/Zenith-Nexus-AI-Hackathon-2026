import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useChatStore } from "../../store/chatStore";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { toastMessage } = useChatStore();

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Fixed Navbar */}
        <Navbar />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-100 p-4 lg:p-6 relative">
          {toastMessage && (
            <div className="absolute top-4 right-6 z-50 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xl animate-in slide-in-from-top-4 duration-200 border border-slate-800">
              {toastMessage}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;