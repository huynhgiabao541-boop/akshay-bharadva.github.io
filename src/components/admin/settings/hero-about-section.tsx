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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { BookUser } from "lucide-react";
import type { SiteSettingsFormValues } from "@/lib/schemas";

export interface HeroAboutSectionProps {
  form: UseFormReturn<SiteSettingsFormValues>;
}

export default function HeroAboutSection({ form }: HeroAboutSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookUser className="size-5 text-primary" /> Hero & About Content
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="profile_data.hero_badge_text"
            render={({ field }) => (
              <FormItem className="sm:col-span-1">
                <FormLabel>Nhãn Badge</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="System Online" />
                </FormControl>
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
                <FormLabel>Chấm sáng (Pulse)</FormLabel>
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
              <FormLabel>Hero Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Full-Stack Developer." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="profile_data.description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hero Description (Markdown)</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <FormField
          control={form.control}
          name="profile_data.bio.0"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About Bio (Paragraph 1)</FormLabel>
              <FormControl>
                <Textarea {...field} rows={4} />
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
              <FormLabel>About Bio (Paragraph 2)</FormLabel>
              <FormControl>
                <Textarea {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
