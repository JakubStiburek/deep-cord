import { Headphones, Settings2 } from "lucide-react";

export const navItems = [
  {
    title: "Records",
    url: "/records",
    icon: Headphones,
    isActive: true,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings2,
    items: [
      {
        title: "General",
        url: "#",
      },
      {
        title: "Billing",
        url: "#",
      },
    ],
  },
];
