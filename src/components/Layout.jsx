import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CopilotChat from "./CopilotChat";
import { SearchProvider } from "../context/SearchContext";

function Layout() {
    return (
        <SearchProvider>
            <Navbar />
            <Outlet />
            <Footer />
            <CopilotChat />
        </SearchProvider>
    );
}

export default Layout;
