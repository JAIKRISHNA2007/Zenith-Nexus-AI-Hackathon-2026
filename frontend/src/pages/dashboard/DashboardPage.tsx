import DashboardLayout from "../../components/dashboard/DashboardLayout";
import ChatWindow from "../../components/chat/ChatWindow";
import ChartPanel from "../../components/visualization/ChartPanel";

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <div className="flex h-full flex-col overflow-hidden rounded-xl shadow lg:flex-row">
        <div className="min-w-0 flex-1">
          <ChatWindow />
        </div>

        <ChartPanel />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;