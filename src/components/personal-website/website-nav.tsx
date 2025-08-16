'use client';

import * as React from 'react';
import Link from 'next/link';

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger
} from '@/components/ui/navigation-menu';

const projects: { title: string; href: string; description: string }[] = [
    {
        title: 'Software',
        href: '/projects/software',
        description: "Software projects I've worked on, personal and college."
    },
    {
        title: 'Weather',
        href: '/projects/weather',
        description: 'Real-time weather information for Victor, NY.'
    },
    {
        title: 'Astronomy',
        href: '/projects/astronomy',
        description: "Astronomy photos I've taken."
    }
];

export function WebsiteNavagationMenu() {
    return (
        <NavigationMenu viewport={false}>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Home</NavigationMenuTrigger>
                    <NavigationMenuContent className="absolute w-55">
                        <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                    <a
                                        className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                                        href="/home"
                                    >
                                        <div className="mt-4 mb-2 text-lg font-medium">
                                            Quick Links
                                        </div>
                                        <p className="text-muted-foreground text-sm leading-tight">
                                            Quick access to important links.
                                        </p>
                                    </a>
                                </NavigationMenuLink>
                            </li>
                            <ListItem href="/home/about" title="About Me">
                                About me and and a brief digital resume.
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Projects</NavigationMenuTrigger>
                    <NavigationMenuContent className="absolute w-55">
                        <ul className="w-50">
                            {projects.map((project) => (
                                <ListItem
                                    key={project.title}
                                    title={project.title}
                                    href={project.href}
                                >
                                    <div className="flex-wrap">{project.description}</div>
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}

function ListItem({
    title,
    children,
    href,
    ...props
}: React.ComponentPropsWithoutRef<'li'> & { href: string }) {
    return (
        <li {...props}>
            <NavigationMenuLink asChild>
                <Link href={href}>
                    <div className="text-sm leading-none font-medium">{title}</div>
                    <div className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                        {children}
                    </div>
                </Link>
            </NavigationMenuLink>
        </li>
    );
}
