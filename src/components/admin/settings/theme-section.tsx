import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette } from "lucide-react";
import { THEME_PRESETS } from "@/lib/constants";
import type { SiteSettingsFormValues } from "@/lib/schemas";

export interface ThemeSectionProps {
  form: UseFormReturn<SiteSettingsFormValues>;
}

const CUSTOM_COLOR_KEYS = [
  "background",
  "foreground",
  "primary",
  "secondary",
  "accent",
  "card",
] as const;

export default function ThemeSection({ form }: ThemeSectionProps) {
  const watchTheme = form.watch("profile_data.default_theme");
  const isCustomTheme = watchTheme === "theme-custom";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="size-5 text-primary" /> Cài đặt Giao diện (Theme)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="presets" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="presets">Mẫu có sẵn</TabsTrigger>
            <TabsTrigger value="custom">Tự điều chỉnh</TabsTrigger>
          </TabsList>

          <TabsContent value="presets" className="space-y-4">
            <FormField
              control={form.control}
              name="profile_data.default_theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chọn mẫu giao diện</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val);
                      // Realtime preview theme class change on document
                      if (typeof window !== "undefined") {
                        const html = document.documentElement;
                        const VALID_THEMES = [
                          "theme-blueprint", "theme-dracula", "theme-nord", "theme-tokyo-night",
                          "theme-catppuccin-mocha", "theme-github-dark", "theme-onedark-pro",
                          "theme-rose-pine", "theme-monokai", "theme-ayu-dark", "theme-solarized-light",
                          "theme-catppuccin-latte", "theme-github-light", "theme-arctic", "theme-paper",
                          "theme-cyberpunk", "theme-ocean", "theme-matrix", "theme-hc-dark", "theme-hc-light",
                          "theme-neobrutalism-light", "theme-neobrutalism-dark", "theme-neobrutalism-punk",
                          "theme-glass-dark", "theme-glass-frost", "theme-glass-aurora", "theme-glass-ocean",
                          "theme-synthwave", "theme-retrowave", "theme-terminal", "theme-custom"
                        ];
                        html.classList.remove(...VALID_THEMES);
                        html.classList.add(val);
                      }
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn một giao diện..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-64">
                      {THEME_PRESETS.map((theme) => (
                        <SelectItem key={theme.value} value={theme.value}>
                          {theme.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Sử dụng bảng màu phối sẵn cho trang web.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-3 bg-secondary/30">
              <Label
                className="cursor-pointer text-sm"
                onClick={() =>
                  form.setValue("profile_data.default_theme", "theme-custom")
                }
              >
                Kích hoạt giao diện tùy chỉnh
              </Label>
              <Switch
                checked={isCustomTheme}
                onCheckedChange={(checked) =>
                  form.setValue(
                    "profile_data.default_theme",
                    checked ? "theme-custom" : "theme-blueprint"
                  )
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {CUSTOM_COLOR_KEYS.map((colorKey) => (
                <FormField
                  key={colorKey}
                  control={form.control}
                  name={`profile_data.custom_theme_colors.${colorKey}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize text-xs">
                        {colorKey}
                      </FormLabel>
                      <div className="flex gap-2 items-center">
                        <div className="relative w-8 h-8 rounded-md border overflow-hidden shrink-0">
                          <input
                            type="color"
                            className="absolute inset-0 w-12 h-12 -top-2 -left-2 cursor-pointer"
                            value={field.value || "#000000"}
                            onChange={field.onChange}
                          />
                        </div>
                        <FormControl>
                          <Input
                            {...field}
                            className="font-mono text-[10px] h-8 px-2"
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <div
              className="mt-4 p-4 rounded-lg border shadow-lg"
              style={{
                backgroundColor: form.watch(
                  "profile_data.custom_theme_colors.background"
                ),
                color: form.watch("profile_data.custom_theme_colors.foreground"),
                borderColor: form.watch(
                  "profile_data.custom_theme_colors.secondary"
                ),
              }}
            >
              <h4 className="font-bold text-sm mb-2">Xem trước</h4>
              <p className="mb-3 text-xs opacity-80">
                Đây là giao diện thực tế của màu sắc tùy chỉnh.
              </p>
              <button
                type="button"
                className="px-3 py-1.5 rounded-md text-xs font-medium"
                style={{
                  backgroundColor: form.watch(
                    "profile_data.custom_theme_colors.primary"
                  ),
                  color: form.watch(
                    "profile_data.custom_theme_colors.background"
                  ),
                }}
              >
                Nút chính
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
