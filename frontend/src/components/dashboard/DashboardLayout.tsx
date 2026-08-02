import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface DashboardLayoutProps{
    children:React.ReactNode;
}

const DashboardLayout = ({children}:DashboardLayoutProps)=>{

    return(

        <div className="flex h-screen">

            <Sidebar/>

            <div className="flex flex-col flex-1">

                <Navbar/>

                <main className="flex-1 bg-slate-100 p-6">

                    {children}

                </main>

            </div>

        </div>

    )

}

export default DashboardLayout;