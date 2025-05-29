import Loading from "@/app/(master-layout)/dashboard/calendar/loading";

const Layout = ({ children }) => {
    return (
        <div fallback={<Loading />}>
            {children}
        </div>
    );
};

export default Layout;
