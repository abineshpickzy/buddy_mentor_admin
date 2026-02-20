import { User, Users, Settings, BookOpen, Shield, Calculator } from "lucide-react";
import { PERMISSIONS } from "@/permissions/permissions";

export const dashboardSidebarItems = [
  { label: "Dashboard", icon: BookOpen, link: "/dashboard/overview" ,},
  { label: "Mentees", icon: Users, link: "/dashboard/mentees" }, 
  { label: "Profile", icon: User, link: "/dashboard/profile" },
  { label: "Settings", icon: Settings, link: "/dashboard/settings" },
];

export const adminSidebarItems = [
  { label: "Mentoring Product", icon: User, link: "/admin/mentoring-product", module:"admin.mentoring_program"  },
  { label: "Roles & Permissions", icon: Shield, link: "/admin/roles-permissions", module:"admin.role" },
  { label: "Users", icon: Users, link: "/admin/users", module:"admin.users" },
  { label: "Settings", icon: Settings, link: "/admin/settings",module:"admin.settings" },
];

export const accountFPSidebarItems = [
  { label: "Financial Overview", icon: Calculator, link: "/account/overview" },
  { label: "Transactions", icon: BookOpen, link: "/account/transactions" },
  { label: "Reports", icon: Settings, link: "/account/reports" },
  { label: "Settings", icon: Settings, link: "/account/settings" },
];