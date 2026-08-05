import {
  Bell,
  Search,
  Moon,
  UserCircle,
  ChevronDown,
} from "lucide-react";

const Navbar = () => {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 lg:px-6">

      {/* Left Section */}
      <div className="min-w-0">
        <h1 className="truncate text-xl font-bold text-slate-800 md:text-2xl">
          Dashboard
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-4 lg:gap-5">

        {/* Search */}
        <div className="relative hidden md:block">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            aria-label="Search chats"
            type="text"
            placeholder="Search chats..."
            className="
              w-56
              lg:w-72
              rounded-lg
              border
              bg-slate-50
              py-2
              pl-10
              pr-4
              text-sm
              outline-none
              transition
              focus:border-blue-500
            "
          />

        </div>

        {/* Theme */}
        <button className="rounded-lg p-2 transition hover:bg-slate-100">
          <Moon size={20} />
        </button>

        {/* Notifications */}
        <button className="relative rounded-lg p-2 transition hover:bg-slate-100">
          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* User */}
        <button className="flex items-center gap-2 rounded-lg p-2 transition hover:bg-slate-100">

          <UserCircle size={34} />

          <div className="hidden text-left xl:block">
            <p className="text-sm font-semibold">
              Jeevesh
            </p>

            <p className="text-xs text-slate-500">
              Frontend Developer
            </p>
          </div>

          <ChevronDown
            size={18}
            className="hidden md:block"
          />

        </button>

      </div>

    </header>
  );
};

export default Navbar;