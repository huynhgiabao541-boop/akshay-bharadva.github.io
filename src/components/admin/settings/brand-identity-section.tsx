import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Fingerprint, ExternalLink, Info } from "lucide-react";
import type { SiteSettingsFormValues } from "@/lib/schemas";

export interface BrandIdentitySectionProps {
  form: UseFormReturn<SiteSettingsFormValues>;
}

export default function BrandIdentitySection({
  form,
}: BrandIdentitySectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Fingerprint className="size-5 text-primary" /> Nhận diện Thương hiệu (Brand Identity)
          </CardTitle>
          <div className="flex items-center gap-2 mt-1.5">
            <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/30 text-[10px]">
              Xuất hiện ở: Header & Trang chủ /
            </Badge>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => window.open("/", "_blank")}
          className="text-xs gap-1.5 border-border hover:bg-secondary"
        >
          <span>Xem trên website</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="profile_data.name"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Tên Nghệ sĩ / Họ tên của bạn</FormLabel>
                <Badge variant="secondary" className="text-[10px]">Xuất hiện ở: Header, Hero & Title</Badge>
              </div>
              <FormControl>
                <Input {...field} placeholder="Ví dụ: Văn Lang Illustrator" />
              </FormControl>
              <FormDescription className="text-xs flex items-center gap-1">
                <Info className="w-3 h-3 text-muted-foreground" /> Khuyến nghị: Độ dài 2 - 30 ký tự (Tên hiển thị thương hiệu).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="profile_data.logo.main"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo Chữ chính (Main Text)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="ART" />
                </FormControl>
                <FormDescription className="text-xs">
                  Ví dụ: <strong>ART</strong> (phần chữ màu trắng/tối).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="profile_data.logo.highlight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo Chữ nổi bật (Highlight)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder=".VLU" />
                </FormControl>
                <FormDescription className="text-xs">
                  Ví dụ: <strong>.VLU</strong> (phần chữ tô màu nhấn Primary).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="profile_data.profile_picture_url"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Đường dẫn Ảnh đại diện (Avatar URL)</FormLabel>
                <Badge variant="secondary" className="text-[10px]">Xuất hiện ở: Trang chủ & Trang About</Badge>
              </div>
              <FormControl>
                <Input {...field} placeholder="https://images.unsplash.com/..." />
              </FormControl>
              <FormDescription className="text-xs flex items-center gap-1">
                <Info className="w-3 h-3 text-muted-foreground" /> Định dạng đường dẫn ảnh hợp lệ (JPG, PNG, WebP). Tỉ lệ 1:1.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="profile_data.show_profile_picture"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-secondary/10">
              <div className="space-y-0.5">
                <FormLabel className="text-sm">Hiển thị Ảnh đại diện Avatar</FormLabel>
                <FormDescription className="text-xs">
                  Bật/tắt avatar cá nhân trên Hero section và trang giới thiệu About.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
