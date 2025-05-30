"use server";

import Loading from "@/app/ui/dashboard/loading/loading";

const Layout = ({ children }) => {

    return (
        <div fallback={<Loading />}>
            {children}
        </div>
    );
};

export default Layout;
