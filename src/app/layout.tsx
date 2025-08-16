import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { WebsiteNavagationMenu } from '@/components/personal-website/website-nav';
import { PaddingBar, SmallPaddingBar } from '@/components/personal-website/padding-bar';
import { IAppConfig, loadAppConfig } from '@/services/configs/app-config.service';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin']
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin']
});

export const metadata: Metadata = {
    title: "Michael's Homepage",
    description: "Michael's personal website programmed with NextJS."
};

const config: IAppConfig = loadAppConfig();

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <div className="flex-wrap">
                    <WebsiteNavagationMenu></WebsiteNavagationMenu>
                    <div className="bg-accent h-4"></div>
                    <SmallPaddingBar></SmallPaddingBar>
                    <div className="p-2">{children}</div>
                    <SmallPaddingBar></SmallPaddingBar>
                    <div className="p-2">
                        {config.ATTRIBUTION}
                        &nbsp;
                        <a
                            style={{ color: 'blue' }}
                            href={config.GITHUB_PROJ_LINK}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {config.GITHUB_PROJ_LINK}
                        </a>
                    </div>
                </div>
            </body>
        </html>
    );
}
