import {
  MessageSquare,
  History,
  Star,
  Settings,
  LogOut,
  Plus,
  BrainCircuit,
} from "lucide-react";

const Sidebar = () => {
  return (
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

      {/* New Chat */}
      <div className="px-4 py-5 lg:px-5">
        <button
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

      {/* Navigation */}
      <nav className="px-4 lg:px-5">
        <p className="mb-3 text-xs uppercase tracking-wider text-slate-400">
          Navigation
        </p>

        <div className="space-y-2">
          <button className="flex w-full items-center gap-3 rounded-lg p-3 transition hover:bg-slate-800">
            <MessageSquare size={20} />
            Chats
          </button>

          <button className="flex w-full items-center gap-3 rounded-lg p-3 transition hover:bg-slate-800">
            <History size={20} />
            History
          </button>

          <button className="flex w-full items-center gap-3 rounded-lg p-3 transition hover:bg-slate-800">
            <Star size={20} />
            Favorites
          </button>
        </div>
      </nav>

      {/* Recent Chats */}
      <div className="mt-8 flex-1 px-4 lg:px-5">
        <p className="mb-3 text-xs uppercase tracking-wider text-slate-400">
          Recent Chats
        </p>

        <div className="space-y-2 text-sm">
          <div className="cursor-pointer rounded-lg bg-slate-800 p-3 transition hover:bg-slate-700">
            Sales Dashboard
          </div>

          <div className="cursor-pointer rounded-lg p-3 transition hover:bg-slate-800">
            Customer Insights
          </div>

          <div className="cursor-pointer rounded-lg p-3 transition hover:bg-slate-800">
            Revenue Analysis
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-700 px-4 py-5 lg:px-5">
        <button className="mb-2 flex w-full items-center gap-3 rounded-lg p-3 transition hover:bg-slate-800">
          <Settings size={20} />
          Settings
        </button>

        <button className="flex w-full items-center gap-3 rounded-lg p-3 text-red-400 transition hover:bg-slate-800">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;