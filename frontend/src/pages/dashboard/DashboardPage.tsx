import DashboardLayout from "../../components/dashboard/DashboardLayout";
import ChatWindow from "../../components/chat/ChatWindow";
import ChartPanel from "../../components/visualization/ChartPanel";

const DashboardPage = () => {
  return (
    <DashboardLayout>

      <div className="flex h-[calc(100vh-120px)] overflow-hidden rounded-xl shadow">

        <div className="flex-1">

          <ChatWindow />

        </div>

        <ChartPanel />

      </div>

    </DashboardLayout>
  );
};

export default DashboardPage;