import { useEffect, useState } from "react";
import {
  LogOut,
  Plus,
  BrainCircuit,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "../../store/chatStore";
import { useAuthStore } from "../../store/authStore";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const {
    conversations,
    activeConversationId,
    fetchConversations,
    selectConversation,
    createNewConversation,
    deleteConversation,
    toastMessage,
  } = useChatStore();

  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNewChat = async () => {
    await createNewConversation(user?.id || 1);
  };

  const confirmDelete = async () => {
    if (deleteId !== null) {
      await deleteConversation(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <>
      <aside
        className="
          hidden
          md:flex
          md:w-64
          lg:w-72
          xl:w-80
          h-full
          flex-col
          bg-slate-900
          text-white
          transition-all
          duration-300
          relative
        "
      >
        {/* Logo */}
        <div className="border-b border-slate-700 px-4 py-6 lg:px-6">
          <div className="flex items-center gap-3">
            <BrainCircuit
              size={34}
              className="text-blue-400"
            />

            <div>
              <h1 className="text-lg font-bold">
                Zenith Nexus
              </h1>

              <p className="text-xs text-slate-400 lg:text-sm">
                AI BI Platform
              </p>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="mx-4 mt-3 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white shadow transition-all">
            {toastMessage}
          </div>
        )}

        {/* New Chat */}
        <div className="px-4 py-5 lg:px-5">
          <button
            onClick={handleNewChat}
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-blue-600
              py-3
              font-semibold
              transition
              hover:bg-blue-700
            "
          >
            <Plus size={18} />
            New Chat
          </button>
        </div>

        {/* Recent Chats */}
        <div className="mt-2 flex-1 px-4 lg:px-5 overflow-y-auto">
          <p className="mb-3 text-xs uppercase tracking-wider text-slate-400">
            Recent Chats
          </p>

          <div className="space-y-2 text-sm">
            {conversations.length === 0 ? (
              <p className="text-xs text-slate-500 p-2">No conversations yet</p>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => selectConversation(conv.id)}
                  className={`group relative flex items-center justify-between cursor-pointer rounded-lg p-3 transition ${
                    activeConversationId === conv.id
                      ? "bg-slate-800 text-white font-medium"
                      : "hover:bg-slate-800 text-slate-300"
                  }`}
                >
                  <span className="truncate pr-6">Conversation #{conv.id}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(conv.id);
                    }}
                    title="Delete Conversation"
                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 text-slate-400 hover:text-red-400 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700 px-4 py-5 lg:px-5">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg p-3 text-red-400 transition hover:bg-slate-800"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl border">
            <h3 className="text-lg font-bold text-slate-900">
              Delete Conversation
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to delete this conversation?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;