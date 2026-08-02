import { Bell, UserCircle } from "lucide-react";

const Navbar = () => {
  return (
    <header className="h-16 bg-white border-b flex justify-between items-center px-6">

      <h1 className="text-2xl font-bold">
        Dashboard
      </h1>

      <div className="flex items-center gap-5">

        <Bell size={22}/>

        <div className="flex items-center gap-2">

          <UserCircle size={30}/>

          <span>Jeevesh</span>

        </div>

      </div>

    </header>
  );
};

export default Navbar;