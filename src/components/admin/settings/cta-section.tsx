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
import { Switch } from "@/components/ui/switch";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Megaphone } from "lucide-react";
import type { SiteSettingsFormValues } from "@/lib/schemas";

export interface CtaSectionProps {
  form: UseFormReturn<SiteSettingsFormValues>;
}

export default function CtaSection({ form }: CtaSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="size-5 text-primary" /> CTA Banner (Call To Action)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="profile_data.cta_banner.show"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel className="text-base font-semibold">
                  Hiển thị khối CTA
                </FormLabel>
                <FormDescription>
                  Bật/tắt khối banner kêu gọi hành động ở cuối trang chủ.
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

        <FormField
          control={form.control}
          name="profile_data.cta_banner.title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề CTA</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Have a project in mind?" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="profile_data.cta_banner.description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nội dung mô tả</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={3}
                  placeholder="I'm always open to discussing new projects..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="profile_data.cta_banner.primary_button_label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nhãn nút chính (Email/Contact)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Get In Touch" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profile_data.cta_banner.secondary_button_label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nhãn nút phụ (Xem thêm)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="More Ways to Connect" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
