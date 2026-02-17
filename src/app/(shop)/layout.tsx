import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { AccessibilityToolbar } from "@/components/AccessibilityToolbar";

import { CookieConsent } from "@/components/CookieConsent";

export default function ShopLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <SiteHeader />
            <div className="pt-36 min-h-screen flex flex-col">
                {/* We can remove flex-1 here if pages already have it, but consistent wrapper is good */}
                {children}
                <Footer />
            </div>
            <WhatsAppButton />
            <AccessibilityToolbar />
            <CookieConsent />
        </>
    );
}
