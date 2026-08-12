import { useState, useEffect } from "react";
import { Bell, Search, Moon, Sun, UserCircle, Database, Check, LogOut, AlertCircle } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useChatStore } from "../../store/chatStore";
import { DatabaseConnectionModal } from "./DatabaseConnectionModal";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const {
    datasetInfo,
    fetchDatasetStatus,
    searchQuery,
    setSearchQuery,
    notifications,
    markNotificationRead,
    clearNotifications,
  } = useChatStore();

  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark" || document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    fetchDatasetStatus();
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const userName = user?.name || user?.email?.split("@")[0] || "User";
  const userSubtext = user?.email || "Authenticated User";
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 px-4 lg:px-6 shadow-xs relative z-30">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <h1 className="truncate text-xl font-bold text-slate-800 dark:text-white md:text-2xl">
            Zenith Nexus BI
          </h1>

          {/* Database Connection Status Button */}
          <button
            onClick={() => setIsDbModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 border border-slate-200 dark:border-slate-700 transition"
            title="Manage BI Database Connection"
          >
            <Database size={15} className="text-blue-600" />
            <span className="max-w-[160px] truncate">{datasetInfo?.name || "Sample E-commerce DB"}</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-4 lg:gap-5">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              aria-label="Search chats"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats & insights..."
              className="w-48 lg:w-64 rounded-xl border bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white py-1.5 pl-10 pr-4 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Connect Database Trigger (Mobile) */}
          <button
            onClick={() => setIsDbModalOpen(true)}
            className="sm:hidden rounded-lg p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Connect Database"
          >
            <Database size={20} />
          </button>

          {/* Theme */}
          <button
            onClick={toggleDarkMode}
            className="rounded-lg p-2 text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
          </button>

          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                setIsProfileOpen(false);
              }}
              className="relative rounded-lg p-2 text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border bg-white dark:bg-slate-800 dark:border-slate-700 shadow-2xl p-4 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b dark:border-slate-700 pb-2.5 mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Activity Alerts</h3>
                    {unreadCount > 0 && (
                      <span className="text-[10px] bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-semibold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No new notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`flex gap-2.5 items-start p-2 rounded-xl cursor-pointer transition ${
                          !n.read ? "bg-blue-50/70 dark:bg-blue-950/30" : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        }`}
                      >
                        {n.type === "success" ? (
                          <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                        ) : n.type === "error" ? (
                          <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                        ) : (
                          <Database size={16} className="text-blue-500 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-xs text-slate-800 dark:text-slate-200">{n.title}</p>
                            <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-4 mt-0.5">{n.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotificationsOpen(false);
              }}
              className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="User Account Menu"
            >
              <UserCircle size={32} className="text-slate-700 dark:text-slate-200" />
              <div className="hidden text-left xl:block">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 capitalize">{userName}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{userSubtext}</p>
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border bg-white dark:bg-slate-800 dark:border-slate-700 shadow-2xl p-3 animate-in fade-in zoom-in-95">
                <div className="border-b dark:border-slate-700 pb-2 mb-2 px-2">
                  <p className="text-xs font-bold text-slate-900 dark:text-white capitalize">{userName}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{userSubtext}</p>
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setIsDbModalOpen(true);
                      setIsProfileOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Database size={15} className="text-blue-500" /> Connection Settings
                  </button>
                  <button
                    onClick={logout}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Database Connection Modal */}
      <DatabaseConnectionModal isOpen={isDbModalOpen} onClose={() => setIsDbModalOpen(false)} />
    </>
  );
};

export default Navbar;