import { useState, useEffect } from "react";
import type { PortfolioSection, PortfolioItem } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import {
  useGetPortfolioContentQuery,
  useGetNavLinksAdminQuery,
  useSaveSectionMutation,
  useDeleteSectionMutation,
  useSavePortfolioItemMutation,
  useDeletePortfolioItemMutation,
  useUpdateSectionOrderMutation,
  useRescanAssetUsageMutation,
} from "@/store/api/adminApi";
import { useConfirm } from "@/components/providers/ConfirmDialogProvider";
import { useIsMobile } from "@/hooks/use-mobile";
import { PageHeader, ManagerWrapper } from "./shared";
import { Plus, LayoutTemplate, ExternalLink, Info, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  SheetState,
  PathOption,
  SectionEditorSheet,
  ItemEditorSheet,
  SectionList,
  SectionDetail,
} from "./content";

// Contextual descriptions for public pages
const PAGE_DESCRIPTIONS: Record<string, { purpose: string; location: string; icon: string }> = {
  "/": {
    purpose: "Trang chủ chính của website. Quản lý các khối giới thiệu, banner, bài viết/tác phẩm nổi bật.",
    location: "Trang chủ Route /",
    icon: "🏠",
  },
  "/about": {
    purpose: "Trang hồ sơ giới thiệu bản thân nghệ sĩ, lịch sử triển lãm, thiết bị sáng tác và học vấn.",
    location: "Trang /about (hoặc /me)",
    icon: "🎨",
  },
  "/projects": {
    purpose: "Trang trưng bày toàn bộ tác phẩm hội họa, concept art, minh họa sách và quá trình vẽ.",
    location: "Trang /projects (hoặc /artworks)",
    icon: "🖼️",
  },
  "/showcase": {
    purpose: "Trang phân tích bài học chuyên sâu (Case Studies) và các thành tựu nổi bật.",
    location: "Trang /showcase",
    icon: "⭐",
  },
  "/commission": {
    purpose: "Trang bảng giá dịch vụ vẽ freelance, minh họa thương mại & điều khoản hợp tác.",
    location: "Trang /commission",
    icon: "💎",
  },
  "/contact": {
    purpose: "Trang thông tin liên hệ, form nhận brief dự án và liên kết mạng xã hội.",
    location: "Trang /contact (hoặc /hire-me)",
    icon: "📬",
  },
};

export default function ContentManager() {
  const confirm = useConfirm();
  const isMobile = useIsMobile();

  const [localSections, setLocalSections] = useState<PortfolioSection[]>([]);
  const [availablePaths, setAvailablePaths] = useState<PathOption[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [sheetState, setSheetState] = useState<SheetState>(null);

  const { data: sections, isLoading: isLoadingSections } = useGetPortfolioContentQuery();
  const { data: navLinks } = useGetNavLinksAdminQuery();
  const [saveSection] = useSaveSectionMutation();
  const [deleteSection] = useDeleteSectionMutation();
  const [saveItem] = useSavePortfolioItemMutation();
  const [deleteItem] = useDeletePortfolioItemMutation();
  const [updateOrder] = useUpdateSectionOrderMutation();
  const [rescanUsage] = useRescanAssetUsageMutation();

  useEffect(() => {
    if (sections) {
      setLocalSections(sections);
      if (!isMobile && !selectedSectionId && sections.length > 0) {
        setSelectedSectionId(sections[0].id);
      }
    }
  }, [sections, isMobile, selectedSectionId]);

  useEffect(() => {
    if (navLinks) {
      const paths = new Set<string>(["/"]);
      navLinks.forEach((link) => paths.add(link.href));
      setAvailablePaths(Array.from(paths).sort().map((path) => ({ label: path, value: path })));
    }
  }, [navLinks]);

  const handleMoveSection = async (sectionId: string, direction: "up" | "down") => {
    const section = localSections.find((s) => s.id === sectionId);
    if (!section) return;

    const samePage = localSections.filter((s) => s.page_path === section.page_path);
    const currentIndex = samePage.findIndex((s) => s.id === sectionId);

    if ((direction === "up" && currentIndex === 0) || (direction === "down" && currentIndex === samePage.length - 1)) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const reordered = [...samePage];
    const [moved] = reordered.splice(currentIndex, 1);
    reordered.splice(newIndex, 0, moved);

    const newSections = localSections.map((s) => {
      if (s.page_path !== section.page_path) return s;
      const idx = reordered.findIndex((r) => r.id === s.id);
      return { ...s, display_order: idx };
    });
    setLocalSections(newSections);

    try {
      await updateOrder(reordered.map((s) => s.id)).unwrap();
      toast.success("Đã lưu thứ tự mục.");
    } catch {
      toast.error("Không thể lưu thứ tự.");
      if (sections) setLocalSections(sections);
    }
  };

  const handleSaveSection = async (data: Partial<PortfolioSection>, options?: { silent?: boolean }) => {
    try {
      const saved = await saveSection(data).unwrap();
      if (!options?.silent) {
        toast.success(`Đã lưu mục "${saved.title}".`);
        setSheetState(null);
      }
      setSelectedSectionId(saved.id);
    } catch (err) {
      toast.error("Không thể lưu mục", { description: getErrorMessage(err) });
    }
  };

  const handleDeleteSection = async (id: string) => {
    const ok = await confirm({
      title: "Xóa mục này?",
      description: "Thao tác này sẽ xóa vĩnh viễn mục này và tất cả các phần tử bên trong.",
      variant: "destructive",
    });
    if (!ok) return;

    try {
      await deleteSection(id).unwrap();
      toast.success("Đã xóa mục.");
      setSelectedSectionId(null);
    } catch (err) {
      toast.error("Không thể xóa mục", { description: getErrorMessage(err) });
    }
  };

  const handleSaveItem = async (itemData: Partial<PortfolioItem>, sectionId: string) => {
    try {
      await saveItem({ ...itemData, section_id: sectionId }).unwrap();
      toast.success("Đã lưu phần tử.");
      await rescanUsage().unwrap();
      setSheetState(null);
    } catch (err) {
      toast.error("Không thể lưu phần tử", { description: getErrorMessage(err) });
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    const ok = await confirm({
      title: "Xóa phần tử?",
      description: "Thao tác này không thể hoàn tác.",
      variant: "destructive",
    });
    if (!ok) return;

    try {
      await deleteItem(itemId).unwrap();
      toast.success("Đã xóa.");
      await rescanUsage().unwrap();
    } catch (err) {
      toast.error("Không thể xóa", { description: getErrorMessage(err) });
    }
  };

  const selectedSection = localSections.find((s) => s.id === selectedSectionId);

  const groupedSections = localSections.reduce(
    (acc, section) => {
      const path = section.page_path || "Uncategorized";
      if (!acc[path]) acc[path] = [];
      acc[path].push(section);
      return acc;
    },
    {} as Record<string, PortfolioSection[]>,
  );

  const activePagePath = selectedSection?.page_path || "/";
  const activePageInfo = PAGE_DESCRIPTIONS[activePagePath] || {
    purpose: "Quản lý nội dung cho đường dẫn " + activePagePath,
    location: "Trang " + activePagePath,
    icon: "📄",
  };

  const renderSheet = () => {
    if (sheetState?.type === "new-item" || sheetState?.type === "edit-item") {
      return (
        <ItemEditorSheet
          item={sheetState.type === "edit-item" ? sheetState.item : null}
          sectionId={sheetState.type === "new-item" ? sheetState.sectionId : sheetState.item.section_id}
          onSave={handleSaveItem}
          onClose={() => setSheetState(null)}
        />
      );
    }
    if (sheetState?.type === "new-section" || sheetState?.type === "edit-section") {
      return (
        <SectionEditorSheet
          section={sheetState.type === "edit-section" ? sheetState.section : null}
          availablePaths={availablePaths}
          onSave={handleSaveSection}
          onClose={() => setSheetState(null)}
        />
      );
    }
    return null;
  };

  if (isMobile && selectedSectionId && selectedSection) {
    return (
      <ManagerWrapper>
        <SectionDetail
          section={selectedSection}
          isMobile={isMobile}
          onBack={() => setSelectedSectionId(null)}
          onEditSection={(section) => setSheetState({ type: "edit-section", section })}
          onDeleteSection={handleDeleteSection}
          onSaveContent={handleSaveSection}
          onNewItem={(sectionId) => setSheetState({ type: "new-item", sectionId })}
          onEditItem={(item) => setSheetState({ type: "edit-item", item })}
          onDeleteItem={handleDeleteItem}
        />
        {renderSheet()}
      </ManagerWrapper>
    );
  }

  return (
    <ManagerWrapper>
      <PageHeader
        title="Quản lý Nội dung Trang (CMS Content Manager)"
        description="Soạn thảo, quản lý các khối nội dung, danh mục và phần tử theo từng trang công khai trên website."
        actions={
          <Button onClick={() => setSheetState({ type: "new-section" })} className="shadow-md">
            <Plus className="mr-2 size-4" /> Thêm khối nội dung mới
          </Button>
        }
      />

      {/* Page Context Banner */}
      {selectedSection && (
        <div className="mb-6 bg-card border border-border p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-start gap-3">
            <span className="text-2xl">{activePageInfo.icon}</span>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-bold text-sm text-foreground">
                  Ngữ cảnh Quản lý: {activePageInfo.location}
                </p>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-[10px]">
                  {activePagePath}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {activePageInfo.purpose}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => window.open(activePagePath, "_blank")}
            className="text-xs gap-1.5 shrink-0"
          >
            <span>Xem trên website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 xl:col-span-3">
          <Card className="overflow-hidden h-full">
            <SectionList
              groupedSections={groupedSections}
              selectedSectionId={selectedSectionId}
              isLoading={isLoadingSections}
              isMobile={isMobile}
              onSelectSection={setSelectedSectionId}
              onNewSection={() => setSheetState({ type: "new-section" })}
              onMoveUp={(id) => handleMoveSection(id, "up")}
              onMoveDown={(id) => handleMoveSection(id, "down")}
            />
          </Card>
        </div>

        <div className="hidden lg:block lg:col-span-8 xl:col-span-9">
          {selectedSection ? (
            <SectionDetail
              section={selectedSection}
              isMobile={isMobile}
              onBack={() => setSelectedSectionId(null)}
              onEditSection={(section) => setSheetState({ type: "edit-section", section })}
              onDeleteSection={handleDeleteSection}
              onSaveContent={handleSaveSection}
              onNewItem={(sectionId) => setSheetState({ type: "new-item", sectionId })}
              onEditItem={(item) => setSheetState({ type: "edit-item", item })}
              onDeleteItem={handleDeleteItem}
            />
          ) : (
            <Card className="border-dashed h-full flex items-center justify-center">
              <CardContent className="py-16 text-center">
                <LayoutTemplate className="size-12 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-lg font-semibold mb-1">Chưa chọn khối nội dung nào</p>
                <p className="text-sm text-muted-foreground">Chọn một khối từ danh sách bên trái để bắt đầu chỉnh sửa.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {renderSheet()}
    </ManagerWrapper>
  );
}