import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, Search, Home, Palette, Sliders, Share2, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  useGetSiteSettingsQuery,
  useUpdateSiteSettingsMutation,
} from "@/store/api/adminApi";
import {
  siteSettingsSchema,
  siteSettingsDefaultValues,
  type SiteSettingsFormValues,
} from "@/lib/schemas";
import { getErrorMessage } from "@/lib/utils";
import { PageHeader, ManagerWrapper } from "./shared";

// Extracted section components
import {
  SettingsSkeleton,
  BrandIdentitySection,
  HeroAboutSection,
  GitHubSection,
  ThemeSection,
  SocialLinksSection,
  StatusPanelSection,
  LayoutSection,
  FooterSection,
  ContactPageSection,
  CtaSection,
  TypographySection,
} from "./settings";

export default function SiteSettingsManager() {
  const [activeTab, setActiveTab] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: settingsData, isLoading: isLoadingSettings } =
    useGetSiteSettingsQuery();
  const [updateSiteSettings, { isLoading: isSubmitting }] =
    useUpdateSiteSettingsMutation();

  const form = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: siteSettingsDefaultValues,
  });

  useEffect(() => {
    if (settingsData) {
      // Helper to convert nulls to empty strings for form compatibility
      const nullsToStrings = (obj: any): any => {
        if (obj === null || obj === undefined) return "";
        if (typeof obj !== "object") return obj;
        if (Array.isArray(obj)) return obj.map(nullsToStrings);
        return Object.fromEntries(
          Object.entries(obj).map(([key, value]) => [
            key,
            nullsToStrings(value),
          ])
        );
      };
      const cleanIdentity = nullsToStrings(settingsData);

      const fetchedSocials = (cleanIdentity.social_links as { id: string; label: string; url: string; is_visible: boolean }[]) || [];
      const mergedSocials = (siteSettingsDefaultValues.social_links || []).map(
        (def) => {
          const fetched = fetchedSocials.find((f) => f.id === def.id);
          return fetched ? { ...def, ...fetched } : def;
        }
      );

      const fetchedColors =
        cleanIdentity.profile_data.custom_theme_colors || {};
      const defaultColors =
        siteSettingsDefaultValues.profile_data.custom_theme_colors!;
      const mergedColors = {
        background: fetchedColors.background || defaultColors.background,
        foreground: fetchedColors.foreground || defaultColors.foreground,
        primary: fetchedColors.primary || defaultColors.primary,
        secondary: fetchedColors.secondary || defaultColors.secondary,
        accent: fetchedColors.accent || defaultColors.accent,
        card: fetchedColors.card || defaultColors.card,
      };

      const mergedProfileData = {
        ...siteSettingsDefaultValues.profile_data,
        ...cleanIdentity.profile_data,
        custom_theme_colors: mergedColors,
        logo: {
          ...siteSettingsDefaultValues.profile_data.logo,
          ...(cleanIdentity.profile_data.logo || {}),
        },
        status_panel: {
          ...siteSettingsDefaultValues.profile_data.status_panel,
          ...(cleanIdentity.profile_data.status_panel || {}),
          show: cleanIdentity.profile_data.status_panel?.show ?? true,
          currently_exploring: {
            ...siteSettingsDefaultValues.profile_data.status_panel
              .currently_exploring,
            ...(cleanIdentity.profile_data.status_panel?.currently_exploring ||
              {}),
            items: cleanIdentity.profile_data.status_panel?.currently_exploring
              ?.items?.length
              ? cleanIdentity.profile_data.status_panel.currently_exploring
                  .items
              : [""],
          },
          latestProject: {
            ...siteSettingsDefaultValues.profile_data.status_panel
              .latestProject,
            ...(cleanIdentity.profile_data.status_panel?.latestProject || {}),
          },
        },
        github_projects_config: {
          ...siteSettingsDefaultValues.profile_data.github_projects_config,
          ...(cleanIdentity.profile_data.github_projects_config || {}),
        },
        contact_page: {
          ...siteSettingsDefaultValues.profile_data.contact_page,
          ...(cleanIdentity.profile_data.contact_page || {}),
        },
        cta_banner: {
          ...siteSettingsDefaultValues.profile_data.cta_banner,
          ...(cleanIdentity.profile_data.cta_banner || {}),
        },
        bio: cleanIdentity.profile_data.bio?.length
          ? cleanIdentity.profile_data.bio
          : [""],
      };

      form.reset({
        portfolio_mode: settingsData.portfolio_mode || "multi-page",
        profile_data: mergedProfileData,
        social_links: mergedSocials,
        footer_data:
          cleanIdentity.footer_data || siteSettingsDefaultValues.footer_data,
      });
    }
  }, [settingsData, form]);

  const onSubmit = async (values: SiteSettingsFormValues) => {
    try {
      await updateSiteSettings(values).unwrap();
      toast.success("Đã cập nhật cài đặt trang web thành công!");
    } catch (err) {
      toast.error("Không thể lưu cài đặt", { description: getErrorMessage(err) });
    }
  };

  const onInvalid = (errors: any) => {
    console.error("Form validation errors:", errors);

    const getFieldNames = (obj: any, prefix = ""): string[] => {
      let fields: string[] = [];
      for (const key in obj) {
        if (!obj[key]) continue;
        const currentPath = prefix ? `${prefix}.${key}` : key;
        if (obj[key].message) {
          // Map technical field path to friendly Vietnamese names
          let friendlyName = currentPath;
          if (currentPath.includes("profile_data.name")) friendlyName = "Tên nghệ sĩ";
          else if (currentPath.includes("profile_data.title")) friendlyName = "Tiêu đề Hero";
          else if (currentPath.includes("profile_data.description")) friendlyName = "Mô tả ngắn Hero";
          else if (currentPath.includes("profile_data.logo.main")) friendlyName = "Logo chữ chính (ART)";
          else if (currentPath.includes("profile_data.logo.highlight")) friendlyName = "Logo chữ phụ (.VLU)";
          else if (currentPath.includes("profile_data.bio")) friendlyName = "Bài giới thiệu Bio";
          else if (currentPath.includes("status_panel.availability")) friendlyName = "Trạng thái nhận vẽ";
          else if (currentPath.includes("status_panel.latestProject.name")) friendlyName = "Tên dự án mới nhất";
          else if (currentPath.includes("status_panel.latestProject.linkText")) friendlyName = "Chữ hiển thị trên Nút bấm dự án (ví dụ: Xem tác phẩm)";
          else if (currentPath.includes("status_panel.latestProject.href")) friendlyName = "Đường dẫn dự án";
          else if (currentPath.includes("github_projects_config.username")) friendlyName = "Tên tài khoản GitHub";
          else if (currentPath.includes("cta_banner.title")) friendlyName = "Tiêu đề Banner Kêu gọi";
          else if (currentPath.includes("cta_banner.description")) friendlyName = "Mô tả Banner Kêu gọi";
          else if (currentPath.includes("footer_data.copyright_text")) friendlyName = "Bản quyền Chân trang (Footer)";
          fields.push(friendlyName);
        } else if (typeof obj[key] === "object") {
          fields = fields.concat(getFieldNames(obj[key], currentPath));
        }
      }
      return fields;
    };

    const invalidFields = Array.from(new Set(getFieldNames(errors)));
    const errorDetail = invalidFields.length > 0
      ? `Các ô cần bổ sung: ${invalidFields.join(", ")}.`
      : "Vui lòng kiểm tra lại các trường bắt buộc đang bị thiếu.";

    toast.error("Không thể lưu cài đặt!", {
      description: errorDetail,
    });
  };

  const isDirty = form.formState.isDirty;

  if (isLoadingSettings) return <SettingsSkeleton />;

  const query = searchQuery.toLowerCase().trim();

  return (
    <ManagerWrapper className="pb-24">
      <PageHeader
        title="Cài đặt trang web"
        description="Quản lý giao diện, thông tin nghệ sĩ và cấu hình tổng thể theo từng nhóm tính năng chuyên biệt."
        actions={
          <Button
            onClick={form.handleSubmit(onSubmit, onInvalid)}
            disabled={isSubmitting}
            className="w-full sm:w-auto shadow-md"
          >
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}{" "}
            Lưu thay đổi
          </Button>
        }
      />

      {/* Search Settings Input */}
      <div className="max-w-6xl mx-auto mb-6 px-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm nhanh thiết lập (ví dụ: Logo, Font, Theme, Bio, GitHub, Commission...)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-card border-border shadow-sm"
          />
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-6xl mx-auto px-1 space-y-6"
        >
          {query ? (
            /* Flattened view when searching */
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Kết quả tìm kiếm cho: <span className="font-semibold text-foreground">"{searchQuery}"</span>
              </div>
              
              {("nhận diện brand logo tên avatar hero bio giới thiệu").includes(query) && (
                <div className="space-y-6 border border-border p-4 rounded-xl bg-card">
                  <Badge variant="outline" className="mb-2 bg-amber-500/10 text-amber-500 border-amber-500/30">
                    Áp dụng cho: Trang chủ / & Header
                  </Badge>
                  <BrandIdentitySection form={form} />
                  <HeroAboutSection form={form} />
                </div>
              )}

              {("theme giao diện màu sắc font chữ typography layout").includes(query) && (
                <div className="space-y-6 border border-border p-4 rounded-xl bg-card">
                  <Badge variant="outline" className="mb-2 bg-blue-500/10 text-blue-500 border-blue-500/30">
                    Áp dụng cho: Toàn bộ Website
                  </Badge>
                  <ThemeSection form={form} />
                  <TypographySection form={form} />
                  <LayoutSection form={form} />
                </div>
              )}

              {("widget status github cta contact liên hệ").includes(query) && (
                <div className="space-y-6 border border-border p-4 rounded-xl bg-card">
                  <Badge variant="outline" className="mb-2 bg-purple-500/10 text-purple-500 border-purple-500/30">
                    Áp dụng cho: Trang chủ & Trang liên hệ /contact
                  </Badge>
                  <StatusPanelSection form={form} />
                  <CtaSection form={form} />
                  <GitHubSection form={form} />
                  <ContactPageSection form={form} />
                </div>
              )}

              {("social mạng xã hội behance instagram email footer bản quyền").includes(query) && (
                <div className="space-y-6 border border-border p-4 rounded-xl bg-card">
                  <Badge variant="outline" className="mb-2 bg-emerald-500/10 text-emerald-500 border-emerald-500/30">
                    Áp dụng cho: Chân trang Footer & Menu
                  </Badge>
                  <SocialLinksSection form={form} />
                  <FooterSection form={form} />
                </div>
              )}
            </div>
          ) : (
            /* Categorized Tabs View (P0 Must-Have) */
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full h-auto p-1 bg-muted/60 mb-6 gap-1">
                <TabsTrigger value="home" className="flex items-center gap-2 py-2.5">
                  <Home className="w-4 h-4" />
                  <span className="truncate">Trang chủ & Nhận diện</span>
                </TabsTrigger>
                <TabsTrigger value="appearance" className="flex items-center gap-2 py-2.5">
                  <Palette className="w-4 h-4" />
                  <span className="truncate">Giao diện & Font</span>
                </TabsTrigger>
                <TabsTrigger value="widgets" className="flex items-center gap-2 py-2.5">
                  <Sliders className="w-4 h-4" />
                  <span className="truncate">Tiện ích & Features</span>
                </TabsTrigger>
                <TabsTrigger value="social" className="flex items-center gap-2 py-2.5">
                  <Share2 className="w-4 h-4" />
                  <span className="truncate">Mạng xã hội & Footer</span>
                </TabsTrigger>
              </TabsList>

              {/* Tab 1: Trang chủ & Nhận diện */}
              <TabsContent value="home" className="space-y-6">
                <div className="flex items-center justify-between bg-card p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/30">
                      Ngữ cảnh: Trang chủ (Route /)
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Chỉnh sửa thông tin thương hiệu cá nhân, tên nghệ sĩ & đoạn giới thiệu Hero.
                    </span>
                  </div>
                </div>
                <BrandIdentitySection form={form} />
                <HeroAboutSection form={form} />
              </TabsContent>

              {/* Tab 2: Giao diện & Font */}
              <TabsContent value="appearance" className="space-y-6">
                <div className="flex items-center justify-between bg-card p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/30">
                      Ngữ cảnh: Toàn bộ Website
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Tùy chỉnh Theme màu sắc, kiểu Font chữ nghệ thuật và kiểu bố cục Portfolio.
                    </span>
                  </div>
                </div>
                <ThemeSection form={form} />
                <TypographySection form={form} />
                <LayoutSection form={form} />
              </TabsContent>

              {/* Tab 3: Tiện ích & Features */}
              <TabsContent value="widgets" className="space-y-6">
                <div className="flex items-center justify-between bg-card p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/30">
                      Ngữ cảnh: Trang chủ & Trang Liên hệ
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Cấu hình bảng trạng thái vẽ, CTA kêu gọi đặt vẽ & dự án GitHub.
                    </span>
                  </div>
                </div>
                <StatusPanelSection form={form} />
                <CtaSection form={form} />
                <GitHubSection form={form} />
                <ContactPageSection form={form} />
              </TabsContent>

              {/* Tab 4: Mạng xã hội & Footer */}
              <TabsContent value="social" className="space-y-6">
                <div className="flex items-center justify-between bg-card p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30">
                      Ngữ cảnh: Footer & Liên kết ngoài
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Quản lý danh sách link Behance, Instagram, ArtStation & bản quyền Footer.
                    </span>
                  </div>
                </div>
                <SocialLinksSection form={form} />
                <FooterSection form={form} />
              </TabsContent>
            </Tabs>
          )}
        </form>
      </Form>

      {/* Sticky Save Banner */}
      <AnimatePresence>
        {isDirty && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.15)]"
          >
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
              <p className="text-sm text-muted-foreground">
                Bạn có những thay đổi chưa lưu
              </p>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => form.reset()}
                  disabled={isSubmitting}
                >
                  Hủy thay đổi
                </Button>
                <Button
                  size="sm"
                  onClick={form.handleSubmit(onSubmit, onInvalid)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 size-4" />
                  )}
                  Lưu thay đổi
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ManagerWrapper>
  );
}
