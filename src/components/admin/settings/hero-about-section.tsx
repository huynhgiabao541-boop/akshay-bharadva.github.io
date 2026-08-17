import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BookUser, ExternalLink, Info } from "lucide-react";
import type { SiteSettingsFormValues } from "@/lib/schemas";

export interface HeroAboutSectionProps {
  form: UseFormReturn<SiteSettingsFormValues>;
}

export default function HeroAboutSection({ form }: HeroAboutSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookUser className="size-5 text-primary" /> Giới thiệu & Tiêu đề Hero (Hero & About Content)
          </CardTitle>
          <div className="flex items-center gap-2 mt-1.5">
            <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/30 text-[10px]">
              Xuất hiện ở: Trang chủ / & Trang About
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="profile_data.hero_badge_text"
            render={({ field }) => (
              <FormItem className="sm:col-span-1">
                <FormLabel>Nhãn Badge Hero</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="System Online" />
                </FormControl>
                <FormDescription className="text-xs">
                  Hiển thị phía trên tiêu đề chính.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profile_data.hero_badge_icon"
            render={({ field }) => (
              <FormItem className="sm:col-span-1">
                <FormLabel>Biểu tượng (Icon)</FormLabel>
                <select
                  {...field}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="terminal">💻 Terminal (Máy tính)</option>
                  <option value="sparkles">✨ Sparkles (Lấp lánh / Art)</option>
                  <option value="palette">🎨 Palette (Bảng màu)</option>
                  <option value="brush">🖌️ Brush (Cọ vẽ)</option>
                  <option value="flame">🔥 Flame (Nổi bật)</option>
                  <option value="check">✅ Checkmark (Đã xác minh)</option>
                  <option value="none">🚫 Không hiển thị Icon</option>
                </select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profile_data.hero_badge_status_color"
            render={({ field }) => (
              <FormItem className="sm:col-span-1">
                <FormLabel>Chấm nhấp nháy (Pulse)</FormLabel>
                <select
                  {...field}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="green">🟢 Green (Online / Sẵn sàng)</option>
                  <option value="blue">🔵 Blue (Available / Nhận việc)</option>
                  <option value="purple">🟣 Purple (Creative / Art)</option>
                  <option value="amber">🟠 Amber (Bận / Busy)</option>
                  <option value="none">🚫 Tắt chấm nhấp nháy</option>
                </select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="profile_data.title"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Tiêu đề Nghề nghiệp (Hero Title)</FormLabel>
                <Badge variant="secondary" className="text-[10px]">Xuất hiện ở: Trang chủ /</Badge>
              </div>
              <FormControl>
                <Input {...field} placeholder="Illustration Student & Digital Artist" />
              </FormControl>
              <FormDescription className="text-xs flex items-center gap-1">
                <Info className="w-3 h-3 text-muted-foreground" /> Khuyên dùng: 10 - 60 ký tự. Ví dụ: "Digital Artist | Van Lang University".
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="profile_data.description"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Mô tả ngắn Hero (Description)</FormLabel>
                <Badge variant="secondary" className="text-[10px]">Xuất hiện ở: Trang chủ / (Hero Block)</Badge>
              </div>
              <FormControl>
                <Textarea {...field} rows={3} placeholder="Chuyên minh họa sách, thiết kế nhân vật và nghệ thuật truyền thông số..." />
              </FormControl>
              <FormDescription className="text-xs">
                Mô tả ngắn định vị phong cách vẽ của bạn (tối đa 2-3 câu).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className="my-4" />

        <FormField
          control={form.control}
          name="profile_data.bio.0"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Bài giới thiệu chi tiết - Đoạn 1 (Bio Paragraph 1)</FormLabel>
                <Badge variant="secondary" className="text-[10px]">Xuất hiện ở: Trang /about & Trang chủ</Badge>
              </div>
              <FormControl>
                <Textarea {...field} rows={3} placeholder="Giới thiệu về trường học, ngành học và đam mê hội họa..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="profile_data.bio.1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bài giới thiệu chi tiết - Đoạn 2 (Bio Paragraph 2)</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} placeholder="Mô tả các dự án cá nhân, sở thích sáng tác và nhận việc freelance..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
