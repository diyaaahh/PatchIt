import Dashboard from "../pages/dashboard";
import { useAuth0 } from "@auth0/auth0-react";
import PotholeReporter from "./user";
import LandingPage from "./landingpage";

export default function Homepage() {
    const { user, isAuthenticated } = useAuth0();
    if(!isAuthenticated){
        return <LandingPage/>
    }
    const isAdmin  = user.email === "admin@gmail.com";

    return (
        <div className="h-screen w-screen overflow-hidden">
            <div className="flex h-full">
                {
                    isAdmin ? <div className="h-full shadow-lg shadow-slate-900/20">
                        <Dashboard/>
                    </div> : <PotholeReporter />
                }
            </div>
        </div>
    );

}
