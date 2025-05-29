"use server";

import Loading from "@/app/(master-layout)/dashboard/report/loading";

const Layout = ({ children }) => {

    return (
        <div fallback={<Loading />}>
            {children}
        </div>
    );
};

export default Layout;
