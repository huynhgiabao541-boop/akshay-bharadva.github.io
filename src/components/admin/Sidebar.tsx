import Link from "next/link";
import { useRouter } from "next/router";
import {
  Banknote,
  BookText,
  LayoutTemplate,
  ListTodo,
  Lock,
  StickyNote,
  Calendar as CalendarIcon,
  BrainCircuit,
  Home,
  Navigation as NavigationIcon,
  ImageIcon,
  Settings,
  FlaskConical,
  LogOut,
  LayoutDashboard,
  CheckSquare,
  Box,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  Megaphone,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useSignOutMutation } from "@/store/api/adminApi";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

const mainNav = [
  { name: "Bảng điều khiển", href: "/admin", icon: Home },
  { name: "Lịch", href: "/admin/calendar", icon: CalendarIcon },
];

const portfolioNav = [
  { name: "Bài viết (Blog)", href: "/admin/blog", icon: BookText },
  { name: "Cập nhật cuộc sống", href: "/admin/life-updates", icon: Megaphone },
  { name: "Nội dung (CMS)", href: "/admin/content", icon: LayoutTemplate },
  { name: "Tài sản & Tệp", href: "/admin/assets", icon: ImageIcon },
];

const productivityNav = [
  { name: "Công việc", href: "/admin/tasks", icon: ListTodo },
  { name: "Ghi chú", href: "/admin/notes", icon: StickyNote },
  { name: "Học tập", href: "/admin/learning", icon: BrainCircuit },
  { name: "Thói quen", href: "/admin/habits", icon: CheckSquare },
];
const financialNav = [
  { name: "Tài chính", href: "/admin/finance", icon: Banknote },
  { name: "Kho & Kiểm kê", href: "/admin/inventory", icon: Box },
];

const systemNav = [
  { name: "Điều hướng", href: "/admin/navigation", icon: NavigationIcon },
  { name: "Cài đặt", href: "/admin/settings", icon: Settings },
  { name: "Bảo mật", href: "/admin/security", icon: Lock },
  { name: "Dọn dẹp hệ thống", href: "/admin/cleanup", icon: Database },
  { name: "Kiểm tra CRUD", href: "/admin/test", icon: FlaskConical },
];

interface SidebarProps {
  onLinkClick?: () => void;
  className?: string;
  isCollapsed?: boolean;
  toggleCollapse?: () => void;
}

export default function Sidebar({
  onLinkClick,
  className,
  isCollapsed = false,
  toggleCollapse,
}: SidebarProps) {
  const router = useRouter();
  const { session } = useAuthGuard();
  const [signOut] = useSignOutMutation();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    await signOut().unwrap();
    router.replace("/admin/login");
  };

  const NavLink = ({
    item,
  }: {
    item: { name: string; href: string; icon: React.ElementType };
  }) => {
    const isActive =
      router.pathname === item.href ||
      (item.href !== "/admin" && router.pathname.startsWith(item.href));

    // Close the sidebar if on mobile when a link is clicked
    const handleClick = () => {
        if (isMobile && onLinkClick) {
            onLinkClick();
        }
    };

    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={item.href}
              onClick={handleClick}
              className={cn(
                "group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                isCollapsed ? "justify-center px-2" : "",
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent side="right">{item.name}</TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div
      className={cn(
        "flex h-full flex-col gap-y-4 overflow-y-auto bg-background py-3",
        isCollapsed ? "px-2" : "px-4",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-10 shrink-0 items-center",
          isCollapsed ? "justify-center" : "justify-between px-2",
        )}
      >
        {!isCollapsed && (
          <Link
            href="/admin"
            className="font-mono text-lg font-semibold tracking-tighter"
          >
            ADMIN<span className="text-primary">.</span>PANEL
          </Link>
        )}
        {toggleCollapse && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="hidden lg:flex shrink-0"
            title={isCollapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </Button>
        )}
      </div>

      <nav className="flex flex-1 flex-col">
        <div className={cn("mb-4", isCollapsed ? "px-0" : "px-1")}>
          {isCollapsed ? (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-full h-9"
                    onClick={() =>
                      document.dispatchEvent(
                        new CustomEvent("open-command-palette"),
                      )
                    }
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Tìm kiếm (Cmd+K)</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button
              variant="outline"
              className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12"
              onClick={() =>
                document.dispatchEvent(
                  new CustomEvent("open-command-palette"),
                )
              }
            >
              <Search className="mr-2 h-4 w-4" />
              <span className="hidden lg:inline-flex">Tìm kiếm...</span>
              <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          )}
        </div>

        <ul role="list" className="flex flex-1 flex-col gap-y-4">
          <li>
            <ul role="list" className={isCollapsed ? "space-y-1" : "-mx-2 space-y-1"}>
              {mainNav.map((item) => (
                <li key={item.name}>
                  <NavLink item={item} />
                </li>
              ))}
            </ul>
          </li>

          <li className="flex-1">
            {isCollapsed ? (
              // Collapsed View: Flat list with separators
              <div className="flex flex-col gap-4">
                <Separator />
                <ul className="space-y-1">
                  {portfolioNav.map((item) => (
                    <li key={item.name}>
                      <NavLink item={item} />
                    </li>
                  ))}
                </ul>
                <Separator />
                <ul className="space-y-1">
                  {productivityNav.map((item) => (
                    <li key={item.name}>
                      <NavLink item={item} />
                    </li>
                  ))}
                </ul>
                <Separator />
                <ul className="space-y-1">
                  {financialNav.map((item) => (
                    <li key={item.name}>
                      <NavLink item={item} />
                    </li>
                  ))}
                </ul>
                <Separator />
                <ul className="space-y-1">
                  {systemNav.map((item) => (
                    <li key={item.name}>
                      <NavLink item={item} />
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              // Expanded View: Accordions
              <Accordion
                type="multiple"
                defaultValue={["portfolio", "productivity", "financial", "system"]}
                className="w-full"
              >
                <AccordionItem value="portfolio" className="border-b-0">
                  <AccordionTrigger className="py-2 text-xs font-mono uppercase text-muted-foreground hover:no-underline">
                    Hồ sơ (Portfolio)
                  </AccordionTrigger>
                  <AccordionContent className="pt-1">
                    <ul className="space-y-1 list-none">
                      {portfolioNav.map((item) => (
                        <li key={item.name}>
                          <NavLink item={item} />
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="productivity" className="border-b-0">
                  <AccordionTrigger className="py-2 text-xs font-mono uppercase text-muted-foreground hover:no-underline">
                    Năng suất
                  </AccordionTrigger>
                  <AccordionContent className="pt-1">
                    <ul className="space-y-1 list-none">
                      {productivityNav.map((item) => (
                        <li key={item.name}>
                          <NavLink item={item} />
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="financial" className="border-b-0">
                  <AccordionTrigger className="py-2 text-xs font-mono uppercase text-muted-foreground hover:no-underline">
                    Tài chính
                  </AccordionTrigger>
                  <AccordionContent className="pt-1">
                    <ul className="space-y-1 list-none">
                      {financialNav.map((item) => (
                        <li key={item.name}>
                          <NavLink item={item} />
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="system" className="border-b-0">
                  <AccordionTrigger className="py-2 text-xs font-mono uppercase text-muted-foreground hover:no-underline">
                    Hệ thống
                  </AccordionTrigger>
                  <AccordionContent className="pt-1">
                    <ul className="space-y-1 list-none">
                      {systemNav.map((item) => (
                        <li key={item.name}>
                          <NavLink item={item} />
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </li>

          <li className={cn("mt-auto border-t border-border", isCollapsed ? "" : "-mx-4")}>
            {session ? (
              <div
                className={cn(
                  "flex items-center p-4",
                  isCollapsed ? "justify-center" : "justify-between",
                )}
              >
                {!isCollapsed && (
                  <div className="truncate">
                    <p className="text-sm font-semibold text-foreground truncate max-w-[150px]">
                      {session.user.email}
                    </p>
                  </div>
                )}
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:text-destructive"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side={isCollapsed ? "right" : "top"}>
                      Đăng xuất
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ) : (
              <div className="p-4">
                <Skeleton className="h-8 w-full" />
              </div>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
}