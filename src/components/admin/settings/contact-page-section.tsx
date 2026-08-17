import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, ExternalLink } from "lucide-react";
import type { SiteSettingsFormValues } from "@/lib/schemas";

export interface ContactPageSectionProps {
  form: UseFormReturn<SiteSettingsFormValues>;
}

export default function ContactPageSection({ form }: ContactPageSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="size-5 text-primary" /> Trang Liên hệ (Contact Page Settings)
          </CardTitle>
          <div className="flex items-center gap-2 mt-1.5">
            <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/30 text-[10px]">
              Xuất hiện ở: Trang /contact
            </Badge>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => window.open("/contact", "_blank")}
          className="text-xs gap-1.5 border-border hover:bg-secondary"
        >
          <span>Xem trên website</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="profile_data.contact_page.show_contact_form"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-secondary/10">
              <div className="space-y-0.5">
                <FormLabel className="text-sm">Khung Form gửi tin nhắn Liên hệ</FormLabel>
                <FormDescription className="text-xs">
                  Hiển thị form gửi tin nhắn và brief công việc cho khách hàng.
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
          name="profile_data.contact_page.show_availability_badge"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-secondary/10">
              <div className="space-y-0.5">
                <FormLabel className="text-sm">Badge Trạng thái Nhận việc (Available)</FormLabel>
                <FormDescription className="text-xs">
                  Hiển thị chỉ báo "Available for Freelance / Work".
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
          name="profile_data.contact_page.show_services"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-secondary/10">
              <div className="space-y-0.5">
                <FormLabel className="text-sm">Khối Dịch vụ Minh họa (Services)</FormLabel>
                <FormDescription className="text-xs">
                  Hiển thị các dịch vụ chính ở phần dưới trang liên hệ.
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
