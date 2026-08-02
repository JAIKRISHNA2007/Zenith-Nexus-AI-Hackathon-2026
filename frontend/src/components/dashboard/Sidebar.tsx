import { MessageSquare, History, Star } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col p-5">
      <h2 className="text-xl font-bold mb-8">
        Zenith Nexus AI
      </h2>

      <nav className="space-y-4">

        <button className="flex items-center gap-3 hover:text-blue-400">
          <MessageSquare size={20}/>
          New Chat
        </button>

        <button className="flex items-center gap-3 hover:text-blue-400">
          <History size={20}/>
          History
        </button>

        <button className="flex items-center gap-3 hover:text-blue-400">
          <Star size={20}/>
          Favorites
        </button>

      </nav>
    </aside>
  );
};

export default Sidebar;