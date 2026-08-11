import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePurgeOldDataMutation } from "@/store/api/adminApi";
import { toast } from "sonner";
import { Trash2, AlertTriangle, Database, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SystemCleanup() {
  const [purgeOldData, { isLoading }] = usePurgeOldDataMutation();

  const [deleteTasks, setDeleteTasks] = useState(true);
  const [tasksDays, setTasksDays] = useState("30");

  const [deleteHabits, setDeleteHabits] = useState(true);
  const [habitsDays, setHabitsDays] = useState("60");

  const [deleteLearning, setDeleteLearning] = useState(true);
  const [learningDays, setLearningDays] = useState("90");

  const [deleteTransactions, setDeleteTransactions] = useState(false);
  const [transactionsDays, setTransactionsDays] = useState("180");

  const [deleteUnpinnedNotes, setDeleteUnpinnedNotes] = useState(false);

  const [lastPurgedResult, setLastPurgedResult] = useState<number | null>(null);

  const handleCleanup = async () => {
    try {
      const res = await purgeOldData({
        deleteDoneTasksOlderThanDays: deleteTasks ? parseInt(tasksDays) : 0,
        deleteHabitLogsOlderThanDays: deleteHabits ? parseInt(habitsDays) : 0,
        deleteLearningSessionsOlderThanDays: deleteLearning ? parseInt(learningDays) : 0,
        deleteTransactionsOlderThanDays: deleteTransactions ? parseInt(transactionsDays) : 0,
        deleteUnpinnedNotes: deleteUnpinnedNotes,
      }).unwrap();

      setLastPurgedResult(res.deletedCount);
      toast.success(`Đã dọn dẹp thành công ${res.deletedCount} bản ghi dữ liệu cũ!`);
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra trong quá trình dọn dẹp dữ liệu.");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dọn dẹp hệ thống</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Dọn dẹp các dữ liệu cũ không cần thiết để giải phóng dung lượng Database Supabase. Toàn bộ Cài đặt trang web và Hồ sơ cá nhân của bạn vẫn được giữ nguyên.
        </p>
      </div>

      <Alert variant="default" className="border-amber-500/50 bg-amber-500/10 text-amber-900 dark:text-amber-200">
        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        <AlertTitle className="font-semibold">Lưu ý trước khi xóa</AlertTitle>
        <AlertDescription className="text-xs mt-1">
          Thao tác dọn dẹp dữ liệu sẽ xóa vĩnh viễn các bản ghi cũ theo cấu hình bên dưới và không thể hoàn tác.
        </AlertDescription>
      </Alert>

      {lastPurgedResult !== null && (
        <Alert variant="default" className="border-green-500/50 bg-green-500/10 text-green-900 dark:text-green-200">
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
          <AlertTitle className="font-semibold">Đã hoàn thành dọn dẹp</AlertTitle>
          <AlertDescription className="text-xs mt-1">
            Hệ thống đã giải phóng và dọn dẹp tổng cộng <strong>{lastPurgedResult}</strong> bản ghi.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Database className="h-5 w-5 text-primary" /> Cấu hình dọn dẹp dữ liệu
          </CardTitle>
          <CardDescription>
            Tùy chọn loại dữ liệu và khoảng thời gian để loại bỏ các bản ghi cũ.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 1. Tasks */}
          <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base font-semibold">Công việc đã hoàn thành (Done Tasks)</Label>
              <p className="text-xs text-muted-foreground">
                Xóa các công việc đã xong từ quá lâu.
              </p>
            </div>
            <div className="flex items-center gap-4">
              {deleteTasks && (
                <Select value={tasksDays} onValueChange={setTasksDays}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="14">Cũ hơn 14 ngày</SelectItem>
                    <SelectItem value="30">Cũ hơn 30 ngày</SelectItem>
                    <SelectItem value="60">Cũ hơn 60 ngày</SelectItem>
                    <SelectItem value="90">Cũ hơn 90 ngày</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <Switch checked={deleteTasks} onCheckedChange={setDeleteTasks} />
            </div>
          </div>

          {/* 2. Habits */}
          <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base font-semibold">Nhật ký thói quen (Habit Logs)</Label>
              <p className="text-xs text-muted-foreground">
                Xóa lịch sử điểm danh thói quen cũ.
              </p>
            </div>
            <div className="flex items-center gap-4">
              {deleteHabits && (
                <Select value={habitsDays} onValueChange={setHabitsDays}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">Cũ hơn 30 ngày</SelectItem>
                    <SelectItem value="60">Cũ hơn 60 ngày</SelectItem>
                    <SelectItem value="90">Cũ hơn 90 ngày</SelectItem>
                    <SelectItem value="180">Cũ hơn 180 ngày</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <Switch checked={deleteHabits} onCheckedChange={setDeleteHabits} />
            </div>
          </div>

          {/* 3. Learning */}
          <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base font-semibold">Lịch sử phiên học tập (Learning Sessions)</Label>
              <p className="text-xs text-muted-foreground">
                Xóa các thời gian học tập / đếm giờ Pomodoro cũ.
              </p>
            </div>
            <div className="flex items-center gap-4">
              {deleteLearning && (
                <Select value={learningDays} onValueChange={setLearningDays}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">Cũ hơn 30 ngày</SelectItem>
                    <SelectItem value="60">Cũ hơn 60 ngày</SelectItem>
                    <SelectItem value="90">Cũ hơn 90 ngày</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <Switch checked={deleteLearning} onCheckedChange={setDeleteLearning} />
            </div>
          </div>

          {/* 4. Transactions */}
          <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base font-semibold">Giao dịch tài chính cũ (Transactions)</Label>
              <p className="text-xs text-muted-foreground">
                Xóa nhật ký thu chi cũ (khuyên dùng giữ lại trừ khi cần dọn gấp).
              </p>
            </div>
            <div className="flex items-center gap-4">
              {deleteTransactions && (
                <Select value={transactionsDays} onValueChange={setTransactionsDays}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="90">Cũ hơn 90 ngày</SelectItem>
                    <SelectItem value="180">Cũ hơn 180 ngày</SelectItem>
                    <SelectItem value="365">Cũ hơn 1 năm</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <Switch checked={deleteTransactions} onCheckedChange={setDeleteTransactions} />
            </div>
          </div>

          {/* 5. Unpinned Notes */}
          <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base font-semibold">Ghi chú không ghim (Unpinned Notes)</Label>
              <p className="text-xs text-muted-foreground">
                Xóa toàn bộ các ghi chú nháp chưa được ghim.
              </p>
            </div>
            <Switch checked={deleteUnpinnedNotes} onCheckedChange={setDeleteUnpinnedNotes} />
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              variant="destructive"
              size="lg"
              onClick={handleCleanup}
              disabled={isLoading}
              className="gap-2"
            >
              <Trash2 className="h-5 w-5" />
              {isLoading ? "Đang xử lý dọn dẹp..." : "Thực hiện Dọn dẹp Ngay"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
