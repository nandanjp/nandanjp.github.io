import { SiteFooter } from "@/components/common/site-footer";
import { SiteHeader } from "@/components/common/site-header";

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <SiteHeader />
            <main className="w-full flex-1 px-4 md:px-8 lg:px-10 xl:px-12">
                {children}
            </main>
            <SiteFooter />
        </>
    );
}
