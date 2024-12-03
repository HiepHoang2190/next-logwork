"use server";

import Loading from "./loading";
const Layout = ({ children }) => {
    

    return (
        <div fallback={<Loading />}>
            {children}
        </div>
    );
};

export default Layout;
