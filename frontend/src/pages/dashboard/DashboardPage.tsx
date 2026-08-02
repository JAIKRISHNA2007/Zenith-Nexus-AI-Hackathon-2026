import DashboardLayout from "../../components/dashboard/DashboardLayout";
import ChatWindow from "../../components/chat/ChatWindow";

const DashboardPage = () => {
  return (
    <DashboardLayout>

      <div className="h-[calc(100vh-120px)] rounded-xl overflow-hidden shadow">

        <ChatWindow />

      </div>

    </DashboardLayout>
  );
};

export default DashboardPage;