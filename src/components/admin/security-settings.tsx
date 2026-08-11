import type React from "react";
import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/supabase/client";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Smartphone,
  Siren,
  Globe,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetMfaFactorsQuery,
  useGetSecuritySettingsQuery,
  useUnenrollMfaFactorMutation,
  useUpdateLockdownLevelMutation,
  useUpdateUserPasswordMutation,
} from "@/store/api/adminApi";
import { Separator } from "../ui/separator";
import { cn, getErrorMessage } from "@/lib/utils";
import { useConfirm } from "../providers/ConfirmDialogProvider";

export default function SecuritySettings() {
  const confirm = useConfirm();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();

  const { data: security } = useGetSecuritySettingsQuery();
  const [updateLockdown, { isLoading: isLocking }] =
    useUpdateLockdownLevelMutation();

  const handleLockdown = async (level: number) => {
    const messages = [
      "Switch to Normal Mode? Site will be public.",
      "Switch to Maintenance Mode? Public site will be inaccessible.",
      "ACTIVATE LOCKDOWN? This is an emergency state.",
    ];
    const isConfirmed = await confirm({
      title: "Confirm Security Level Change",
      description: messages[level],
      variant: level === 2 ? "destructive" : "default",
      confirmText: "Yes, Change Level",
    });

    if (!isConfirmed) return;

    try {
      await updateLockdown(level).unwrap();
      toast.success(`Security Level set to ${level}`);
    } catch (err) {
      toast.error("Failed to change security level");
    }
  };

  const level = security?.lockdown_level || 0;

  const {
    data: factors = [],
    isLoading: isLoadingFactors,
    error: factorsError,
  } = useGetMfaFactorsQuery();
  const [unenrollFactor, { isLoading: isUnenrolling }] =
    useUnenrollMfaFactorMutation();
  const [updatePassword, { isLoading: isUpdatingPassword }] =
    useUpdateUserPasswordMutation();

  const handleUnenroll = async (factorId: string) => {
    if (!supabase) return;
    const isConfirmed = await confirm({
      title: "Remove 2FA Method?",
      description:
        "Removing your only 2FA method may lock you out until you set it up again upon next login.",
      variant: "destructive",
      confirmText: "Remove",
    });

    if (!isConfirmed) return;
    try {
      await unenrollFactor(factorId).unwrap();
      toast.success("MFA method removed successfully.");
      const { data: aalData } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aalData?.currentLevel !== "aal2") {
        router.push("/admin/login");
      }
    } catch (err: unknown) {
      toast.error("Failed to unenroll MFA", { description: getErrorMessage(err) });
    }
  };

  const mfaEnabled = factors.some((f) => f.status === "verified");

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    try {
      await updatePassword(newPassword).unwrap();
      toast.success("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      setPasswordError("Failed to update password: " + msg);
      toast.error("Password Update Failed", { description: msg });
    }
  };

  const isLoading = isLoadingFactors || isUnenrolling;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-4xl space-y-8 pb-20 md:pb-0"
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Cài đặt bảo mật</h2>
        <p className="text-muted-foreground text-sm">
          Quản lý bảo mật tài khoản và xác thực hai yếu tố (2FA).
        </p>
      </div>

      {!!factorsError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {factorsError && typeof factorsError === "object" && "message" in factorsError ? String((factorsError as { message: unknown }).message) : "Không thể tải trạng thái 2FA"}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="shrink-0">
                {mfaEnabled ? (
                  <ShieldCheck className="h-10 w-10 text-green-500" />
                ) : (
                  <ShieldAlert className="h-10 w-10 text-yellow-500" />
                )}
              </div>
              <div>
                <CardTitle className="text-lg">
                  Xác thực 2 yếu tố (2FA / MFA)
                </CardTitle>
                <CardDescription className="mt-1">
                  {mfaEnabled
                    ? "Tài khoản của bạn đã được bảo vệ với lớp xác thực bổ sung."
                    : "Thêm một lớp bảo mật bổ sung để bảo vệ tài khoản."}
                </CardDescription>
              </div>
            </div>
            <Badge
              variant={mfaEnabled ? "default" : "secondary"}
              className={cn(
                "w-fit mt-2 sm:mt-0",
                mfaEnabled ? "bg-green-500/15 text-green-600" : "",
              )}
            >
              {mfaEnabled ? "Đã bật" : "Chưa bật"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {!mfaEnabled && !isLoading && (
            <div className="text-center p-6 border bg-secondary/30 rounded-lg">
              <h3 className="font-semibold">2FA chưa được kích hoạt</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Bảo vệ tài khoản của bạn khỏi truy cập trái phép.
              </p>
              <Button
                onClick={() => router.push("/admin/setup-mfa")}
                className="w-full sm:w-auto"
              >
                <Smartphone className="mr-2 size-4" /> Bật 2FA Ngay
              </Button>
            </div>
          )}
          {mfaEnabled && factors.length > 0 && (
            <>
              <h4 className="text-sm font-semibold mb-2">
                Thiết bị xác thực đã đăng ký
              </h4>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên thiết bị</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {factors.map((factor) => (
                      <TableRow key={factor.id}>
                        <TableCell className="font-medium">
                          {factor.friendly_name || `Ứng dụng xác thực`}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              factor.status === "verified"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {factor.status === "verified" ? "Đã xác minh" : factor.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            onClick={() => handleUnenroll(factor.id)}
                            variant="destructive"
                            size="sm"
                            disabled={isLoading}
                          >
                            Xóa
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
        {mfaEnabled && (
          <CardFooter className="border-t pt-4 bg-muted/5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/admin/setup-mfa")}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Thêm phương thức mới
            </Button>
          </CardFooter>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="size-5 text-primary" /> Đổi mật khẩu
          </CardTitle>
          <CardDescription>
            Cập nhật mật khẩu đăng nhập. Bạn sẽ cần đăng nhập lại ở các phiên làm việc khác.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div>
              <Label htmlFor="new-password">Mật khẩu mới</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="mt-1.5"
              />
            </div>
            {passwordError && (
              <p className="text-sm font-medium text-destructive bg-destructive/10 p-2 rounded">
                {passwordError}
              </p>
            )}
            <Button
              type="submit"
              disabled={isUpdatingPassword || !newPassword || !confirmPassword}
              className="w-full sm:w-auto"
            >
              {isUpdatingPassword ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Đang cập nhật...
                </>
              ) : (
                "Cập nhật mật khẩu"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-red-500/30 bg-red-500/5">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded-full animate-pulse shrink-0">
              <Siren className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <CardTitle className="text-red-500">Giao thức khẩn cấp</CardTitle>
              <CardDescription>
                Kiểm soát quyền truy cập toàn trang web trong trường hợp khẩn cấp.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleLockdown(0)}
            disabled={isLocking}
            className={cn(
              "flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all duration-200 h-32",
              level === 0
                ? "border-green-500 bg-green-500/10 shadow-sm"
                : "border-border bg-background hover:border-green-500/50 hover:bg-green-500/5",
            )}
          >
            <Globe
              className={cn(
                "size-8 mb-2",
                level === 0 ? "text-green-500" : "text-muted-foreground",
              )}
            />
            <span className="font-bold">Cấp 0: Bình thường</span>
            <span className="text-xs text-muted-foreground mt-1 text-center">
              Website hoạt động công khai.
            </span>
          </button>

          <button
            onClick={() => handleLockdown(1)}
            disabled={isLocking}
            className={cn(
              "flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all duration-200 h-32",
              level === 1
                ? "border-orange-500 bg-orange-500/10 shadow-sm"
                : "border-border bg-background hover:border-orange-500/50 hover:bg-orange-500/5",
            )}
          >
            <Lock
              className={cn(
                "size-8 mb-2",
                level === 1 ? "text-orange-500" : "text-muted-foreground",
              )}
            />
            <span className="font-bold">Cấp 1: Bảo trì</span>
            <span className="text-xs text-muted-foreground mt-1 text-center">
              Ẩn website. Chỉ Admin truy cập.
            </span>
          </button>

          <button
            onClick={() => handleLockdown(2)}
            disabled={isLocking}
            className={cn(
              "flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all duration-200 h-32",
              level === 2
                ? "border-red-600 bg-red-600/20 shadow-sm"
                : "border-border bg-background hover:border-red-600/50 hover:bg-red-600/5",
            )}
          >
            <Siren
              className={cn(
                "size-8 mb-2",
                level === 2 ? "text-red-600" : "text-muted-foreground",
              )}
            />
            <span className="font-bold text-red-600">Cấp 2: Khóa khẩn cấp</span>
            <span className="text-xs text-muted-foreground mt-1 text-center">
              API chỉ đọc. Không cho phép chỉnh sửa.
            </span>
          </button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Khuyến nghị bảo mật</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {[
              "Lưu giữ ứng dụng xác thực của bạn an toàn và có bản sao lưu.",
              "Không chia sẻ mật khẩu hoặc mã MFA với bất kỳ ai.",
              "Sử dụng mật khẩu mạnh, duy nhất từ trình quản lý mật khẩu.",
              "Đăng xuất khi hoàn tất quản lý trang web trên thiết bị dùng chung.",
            ].map((tip) => (
              <li key={tip} className="flex items-start">
                <CheckCircle className="mr-3 mt-0.5 size-4 shrink-0 text-primary" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}