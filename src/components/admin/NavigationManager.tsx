import React, { useState, useEffect, DragEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, Plus, Edit, Trash2, GripVertical, X, Globe, AlertCircle, Sparkles, HelpCircle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  useGetNavLinksAdminQuery,
  useSaveNavLinkMutation,
  useDeleteNavLinkMutation,
} from "@/store/api/adminApi";
import { cn, getErrorMessage } from "@/lib/utils";
import { useConfirm } from "../providers/ConfirmDialogProvider";
import { PageHeader, ManagerWrapper } from "./shared";
import { useIsMobile } from "@/hooks/use-mobile";

type NavLink = {
  id: string;
  label: string;
  href: string;
  display_order: number;
  is_visible: boolean;
};

// Reserved Slugs that cannot be used for public dynamic pages
const RESERVED_SLUGS = [
  "admin",
  "api",
  "login",
  "signup",
  "setup-mfa",
  "mfa-challenge",
  "404",
  "500",
  "_app",
  "_document",
  "components",
];

// Helper to normalize slug
const normalizeSlug = (input: string): string => {
  if (!input) return "";
  let clean = input.trim();
  // Ensure leading slash
  if (!clean.startsWith("/")) {
    clean = "/" + clean;
  }
  // Convert spaces to hyphens, lowercase, remove special characters except slashes and hyphens
  clean = clean
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9\/-]/g, "-") // replace non-alphanumeric except / and - with -
    .replace(/-+/g, "-"); // remove double hyphens

  return clean;
};

const LinkForm = ({
  link,
  existingLinks,
  onSave,
  onCancel,
}: {
  link: Partial<NavLink> | null;
  existingLinks: NavLink[];
  onSave: (data: Partial<NavLink>) => void;
  onCancel: () => void;
}) => {
  const [label, setLabel] = useState(link?.label || "");
  const [href, setHref] = useState(link?.href || "");
  const [error, setError] = useState<string | null>(null);

  // Quick slug presets
  const applyPreset = (presetLabel: string, presetHref: string) => {
    setLabel(presetLabel);
    setHref(presetHref);
    setError(null);
  };

  const handleHrefChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHref(val);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizeSlug(href);

    if (!normalized || normalized === "/") {
      if (href !== "/") {
        setError("Đường dẫn (Slug) không được để trống.");
        return;
      }
    }

    const firstSegment = normalized.replace(/^\//, "").split("/")[0];

    // Check reserved slugs
    if (RESERVED_SLUGS.includes(firstSegment)) {
      setError(`Slug "/${firstSegment}" là đường dẫn hệ thống đã được bảo vệ (Reserved). Vui lòng chọn slug khác.`);
      return;
    }

    // Check duplicate slug with other items
    const isDuplicate = existingLinks.some(
      (l) => l.id !== link?.id && normalizeSlug(l.href) === normalized
    );

    if (isDuplicate) {
      setError(`Đường dẫn "${normalized}" đã tồn tại trên thanh menu. Vui lòng đặt slug duy nhất.`);
      return;
    }

    onSave({ ...link, label, href: normalized });
  };

  const currentOrigin = typeof window !== "undefined" ? window.location.origin : "https://domain.com";
  const normalizedPreview = normalizeSlug(href);
  const fullPathPreview = `${currentOrigin}${normalizedPreview || "/slug"}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pt-4">
      {error && (
        <Alert variant="destructive" className="py-2.5">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-xs font-bold">Lỗi đường dẫn Slug</AlertTitle>
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}

      {/* Quick Presets for Illustration Artists */}
      <div className="space-y-1.5">
        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Gợi ý đổi Slug thông dụng cho Artist:
        </span>
        <div className="flex flex-wrap gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-[11px] h-7 py-0"
            onClick={() => applyPreset("Giới thiệu", "/me")}
          >
            /about → /me
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-[11px] h-7 py-0"
            onClick={() => applyPreset("Tác phẩm", "/artworks")}
          >
            /projects → /artworks
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-[11px] h-7 py-0"
            onClick={() => applyPreset("Đặt vẽ", "/commission")}
          >
            /commission
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-[11px] h-7 py-0"
            onClick={() => applyPreset("Liên hệ", "/hire-me")}
          >
            /contact → /hire-me
          </Button>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="label">Tên hiển thị trên Menu (Title / Label)</Label>
        <Input
          id="label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Ví dụ: Giới thiệu, Artworks, Commission..."
          required
          autoFocus
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="href">Đường dẫn trang (Slug / Route)</Label>
        <Input
          id="href"
          value={href}
          onChange={handleHrefChange}
          placeholder="Ví dụ: /me, /artworks, /gallery..."
          required
        />
        <p className="text-xs text-muted-foreground">
          Hệ thống sẽ tự động chuẩn hóa: viết thường, đổi dấu cách thành dấu gạch ngang <code>-</code>.
        </p>
      </div>

      {/* Full Path URL Preview */}
      <div className="p-3 bg-secondary/30 rounded-lg border border-border space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Globe className="w-3.5 h-3.5 text-primary" />
          <span>Xem trước Đường dẫn thực tế (Full Path Preview):</span>
        </div>
        <p className="text-xs font-mono font-semibold text-primary break-all">
          {fullPathPreview}
        </p>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit">Lưu liên kết & Slug</Button>
      </div>
    </form>
  );
};

export default function NavigationManager() {
  const confirm = useConfirm();
  const isMobile = useIsMobile();

  const [editingLink, setEditingLink] = useState<NavLink | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [localLinks, setLocalLinks] = useState<NavLink[]>([]);
  const [draggedLinkId, setDraggedLinkId] = useState<string | null>(null);

  const { data: links = [], isLoading } = useGetNavLinksAdminQuery();
  const [saveNavLink] = useSaveNavLinkMutation();
  const [deleteNavLink] = useDeleteNavLinkMutation();

  useEffect(() => {
    setLocalLinks(links);
  }, [links]);

  const handleSave = async (data: Partial<NavLink>) => {
    try {
      await saveNavLink(data).unwrap();
      toast.success("Đã lưu liên kết & Slug điều hướng thành công.");
      setIsSheetOpen(false);
    } catch (err) {
      toast.error("Không thể lưu liên kết", { description: getErrorMessage(err) });
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm({
      title: "Xóa liên kết điều hướng?",
      description:
        "Thao tác này sẽ xóa liên kết khỏi thanh menu chính trên trang web của bạn.",
      variant: "destructive",
      confirmText: "Xóa",
    });

    if (!isConfirmed) return;
    try {
      await deleteNavLink(id).unwrap();
      toast.success("Đã xóa liên kết.");
      if (editingLink?.id === id) setIsSheetOpen(false);
    } catch (err) {
      toast.error("Không thể xóa liên kết", { description: getErrorMessage(err) });
    }
  };

  const handleToggleVisibility = async (link: NavLink) => {
    if (editingLink?.id === link.id) {
      setEditingLink({ ...editingLink, is_visible: !link.is_visible });
    }

    try {
      await saveNavLink({ id: link.id, is_visible: !link.is_visible }).unwrap();
      toast.success(
        `"${link.label}" hiện đang ${!link.is_visible ? "hiển thị" : "ẩn"}.`,
      );
    } catch (err) {
      if (editingLink?.id === link.id) {
        setEditingLink({ ...editingLink, is_visible: link.is_visible });
      }
      toast.error("Không thể cập nhật trạng thái ẩn/hiện", { description: getErrorMessage(err) });
    }
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, linkId: string) => {
    if (isMobile) {
      e.preventDefault();
      return;
    }
    setDraggedLinkId(linkId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (targetLinkId: string) => {
    if (!draggedLinkId || draggedLinkId === targetLinkId) return;

    const reorderedLinks = [...localLinks];
    const draggedIndex = reorderedLinks.findIndex(
      (l) => l.id === draggedLinkId,
    );
    const targetIndex = reorderedLinks.findIndex((l) => l.id === targetLinkId);

    const [draggedItem] = reorderedLinks.splice(draggedIndex, 1);
    reorderedLinks.splice(targetIndex, 0, draggedItem);

    setLocalLinks(reorderedLinks);
    setDraggedLinkId(null);

    try {
      const updatePromises = reorderedLinks.map((link, index) =>
        saveNavLink({ id: link.id, display_order: index }),
      );
      await Promise.all(updatePromises);
      toast.success("Đã lưu thứ tự menu.");
    } catch {
      toast.error("Không thể lưu thứ tự mới.");
      setLocalLinks(links);
    }
  };

  return (
    <ManagerWrapper>
      <PageHeader
        title="Quản lý Điều hướng & Slug trang web"
        description="Quản lý tên hiển thị, tùy chỉnh đường dẫn Slug (ví dụ: đổi /about thành /me) và sắp xếp thứ tự Menu."
        actions={
          <Button
            onClick={() => {
              setEditingLink(null);
              setIsSheetOpen(true);
            }}
            className="w-full sm:w-auto shadow-md"
          >
            <Plus className="mr-2 size-4" /> Thêm liên kết / Trang mới
          </Button>
        }
      />

      {/* Guide Notice */}
      <div className="mb-6 bg-card border border-border p-4 rounded-xl flex items-start gap-3 shadow-sm">
        <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-semibold text-foreground">
            Đổi Slug linh hoạt & Tùy chỉnh Menu
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Bạn có thể dễ dàng thay đổi đường dẫn của bất kỳ trang công khai nào (ví dụ đổi <code>/about</code> thành <code>/me</code>, hoặc <code>/projects</code> thành <code>/artworks</code>). Khi bạn đổi Slug, liên kết trên Menu Header & Chân trang sẽ tự động cập nhật!
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách liên kết menu & Slug</CardTitle>
          <CardDescription>
            {isMobile
              ? "Quản lý liên kết và slug của các trang."
              : "Kéo thả để sắp xếp thứ tự hiển thị menu. Bấm nút sửa để đổi Slug đường dẫn."}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <div className="space-y-2">
              {localLinks.map((link) => (
                <div
                  key={link.id}
                  draggable={!isMobile}
                  onDragStart={(e) => handleDragStart(e, link.id)}
                  onDrop={() => handleDrop(link.id)}
                  onDragOver={handleDragOver}
                  className={cn(
                    "flex items-center gap-3 rounded-md p-3 border bg-card transition-all hover:border-primary/50",
                    draggedLinkId === link.id && "opacity-50 scale-95",
                  )}
                >
                  {!isMobile && (
                    <GripVertical className="size-5 text-muted-foreground cursor-grab shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-medium truncate">{link.label}</p>
                      <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                        Route: {link.href}
                      </Badge>
                      {isMobile && (
                        <div
                          className={cn(
                            "h-2 w-2 rounded-full",
                            link.is_visible ? "bg-green-500" : "bg-muted",
                          )}
                        />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-mono truncate">
                      Full Path: {typeof window !== "undefined" ? window.location.origin : ""}{link.href}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isMobile && (
                      <Switch
                        checked={link.is_visible}
                        onCheckedChange={() => handleToggleVisibility(link)}
                        aria-label="Ẩn/hiện liên kết"
                      />
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setEditingLink(link);
                        setIsSheetOpen(true);
                      }}
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleDelete(link.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {localLinks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Chưa có liên kết nào. Hãy thêm một liên kết để bắt đầu.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-lg w-full flex flex-col">
          <div className="flex justify-between items-center">
            <SheetHeader>
              <SheetTitle>
                {editingLink ? "Chỉnh sửa" : "Thêm mới"} liên kết & Slug
              </SheetTitle>
              <SheetDescription>
                Tùy chỉnh tên hiển thị và đường dẫn URL hiển thị trên thanh menu.
              </SheetDescription>
            </SheetHeader>
            <SheetClose asChild>
              <Button type="button" variant="ghost">
                <X />
              </Button>
            </SheetClose>
          </div>

          {isMobile && editingLink && (
            <div className="flex items-center justify-between border rounded-md p-3 my-4 bg-muted/20">
              <div className="space-y-0.5">
                <Label>Hiển thị trên Menu</Label>
                <p className="text-xs text-muted-foreground">Bật để hiển thị trên menu chính</p>
              </div>
              <Switch
                checked={editingLink.is_visible}
                onCheckedChange={() => handleToggleVisibility(editingLink)}
              />
            </div>
          )}

          <LinkForm
            link={editingLink}
            existingLinks={localLinks}
            onSave={handleSave}
            onCancel={() => setIsSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </ManagerWrapper>
  );
}