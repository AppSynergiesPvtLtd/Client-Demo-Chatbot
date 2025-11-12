"use client";

import { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconArrowLeft,
  IconMessage,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconBrandTabler className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Chatbot",
      href: "/dashboard/chatbot",
      icon: (
        <IconMessage className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: (
        <IconUserBolt className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: (
        <IconSettings className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-100 dark:bg-neutral-900">
      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <Link key={idx} href={link.href}>
                  <SidebarLink
                    link={{
                      key: link.label,
                      label: link.label,
                      href: link.href,
                      icon: link.icon,
                    }}
                  />
                </Link>
              ))}
            </div>
          </div>

          <SidebarLink
            link={{
              key: "profile",
              label: "Manu Arora",
              href: "#",
              icon: (
                <img
                  src="https://assets.aceternity.com/manu.png"
                  className="h-7 w-7 shrink-0 rounded-full"
                  width={50}
                  height={50}
                  alt="Avatar"
                />
              ),
            }}
          />
        </SidebarBody>
      </Sidebar>

      {/* Page Content */}
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}

const Logo = () => (
  <a
    href="#"
    className="flex items-center space-x-2 py-1 text-sm font-normal text-black"
  >
    <div className="h-5 w-6 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-medium whitespace-pre text-black dark:text-white"
    >
      Acet Labs
    </motion.span>
  </a>
);

const LogoIcon = () => (
  <a
    href="#"
    className="flex items-center space-x-2 py-1 text-sm font-normal text-black"
  >
    <div className="h-5 w-6 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
  </a>
);
