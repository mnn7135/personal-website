import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { WebsiteNavagationMenu } from '@/components/personal-website/website-nav';
import { SmallPaddingBar } from '@/components/personal-website/padding-bar';
import { IAppConfig, loadAppConfig } from '@/services/configs/app-config.service';
import WeatherDataProvider from '@/components/providers/weatherDataProvider';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin']
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin']
});

export const metadata: Metadata = {
    title: 'WeatherWolf',
    description: 'Providing weather coverage for the Finger Lakes Region. Be weather aWERE!'
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
                    <WeatherDataProvider>
                        <WebsiteNavagationMenu></WebsiteNavagationMenu>
                        <div className="h-2 bg-gray-300"></div>
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
                    </WeatherDataProvider>
                </div>
            </body>
        </html>
    );
}
