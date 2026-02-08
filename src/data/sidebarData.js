import { User, Users, Settings, BookOpen, Shield, Calculator } from "lucide-react";
import { PERMISSIONS } from "@/permissions/permissions";

export const dashboardSidebarItems = [
  { label: "Dashboard", icon: BookOpen, link: "/dashboard/overview" ,},
  { label: "Mentees", icon: Users, link: "/dashboard/mentees" }, 
  { label: "Profile", icon: User, link: "/dashboard/profile" },
  { label: "Settings", icon: Settings, link: "/dashboard/settings" },
];

export const adminSidebarItems = [
  { label: "Mentoring Category", icon: User, link: "/admin/mentoring-category", permission:"admin.mentoring_program.view"  },
  { label: "Roles & Permissions", icon: Shield, link: "/admin/roles-permissions", permission:"admin.role.view" },
  { label: "Users", icon: Users, link: "/admin/users", permission:"admin.users.view" },
  { label: "Settings", icon: Settings, link: "/admin/settings", },
];

export const accountFPSidebarItems = [
  { label: "Financial Overview", icon: Calculator, link: "/account/overview" },
  { label: "Transactions", icon: BookOpen, link: "/account/transactions" },
  { label: "Reports", icon: Settings, link: "/account/reports" },
  { label: "Settings", icon: Settings, link: "/account/settings" },
];