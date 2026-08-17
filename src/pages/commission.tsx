import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, HelpCircle, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const commissionTiers = [
  {
    id: "headshot",
    name: "Headshot / Portrait",
    price: "800.000 VNĐ - 1.200.000 VNĐ",
    usdPrice: "$35 - $50",
    description: "Minh họa chân dung từ ngực trở lên, tập trung vào biểu cảm khuôn mặt và hiệu ứng ánh sáng.",
    features: [
      "File gốc độ phân giải cao (300 DPI)",
      "Background đơn giản hoặc mờ nghệ thuật",
      "Sửa tối đa 3 lần ở bước Sketch",
      "Thời gian hoàn thành: 3 - 5 ngày",
    ],
    sampleImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "halfbody",
    name: "Half-Body Artwork",
    price: "1.500.000 VNĐ - 2.200.000 VNĐ",
    usdPrice: "$65 - $95",
    description: "Minh họa nhân vật từ nửa người (eo trở lên), thể hiện rõ trang phục, phụ kiện và tư thế dáng vẽ.",
    popular: true,
    features: [
      "File PNG / PSD màu chuẩn sRGB",
      "Bao gồm hiệu ứng lighting & màu sắc hoàn thiện",
      "Sửa tối đa 3 lần Sketch, 2 lần Color Base",
      "Thời gian hoàn thành: 5 - 7 ngày",
    ],
    sampleImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "fullbody",
    name: "Full-Body & Concept Art",
    price: "2.500.000 VNĐ - 4.000.000 VNĐ",
    usdPrice: "$110 - $175",
    description: "Vẽ toàn thân nhân vật kết hợp bối cảnh (Background Detail), thích hợp cho Bìa sách, Book Illustration, Concept Art.",
    features: [
      "Trọn gói quy trình Thumbnail -> Sketch -> Final Render",
      "Background phông cảnh chi tiết (Landscape/Urban)",
      "Bảo đảm bản quyền sử dụng Truyền thông / Thương mại",
      "Thời gian hoàn thành: 7 - 14 ngày",
    ],
    sampleImage: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop",
  },
];

export default function CommissionPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Available for Freelance & Commission
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Commission Guide & Pricing Sheet
          </h1>
          <p className="text-neutral-400 text-lg">
            Bảng giá dịch vụ vẽ minh họa cá nhân, bìa sách, concept art & quy định đặt vẽ hợp tác.
          </p>
        </div>

        {/* Pricing Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {commissionTiers.map((tier) => (
            <motion.div
              key={tier.id}
              whileHover={{ y: -6 }}
              className={`relative rounded-2xl border bg-neutral-900 overflow-hidden flex flex-col justify-between ${
                tier.popular
                  ? "border-amber-500 shadow-xl shadow-amber-500/10"
                  : "border-neutral-800"
              }`}
            >
              {tier.popular && (
                <span className="absolute top-0 right-0 bg-amber-500 text-black text-xs font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">
                  Nổi bật nhất
                </span>
              )}

              <div>
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={tier.sampleImage}
                    alt={tier.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent"></div>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
                  <div>
                    <span className="text-2xl font-extrabold text-amber-400">
                      {tier.price}
                    </span>
                    <span className="block text-xs text-neutral-400">
                      (khoảng {tier.usdPrice})
                    </span>
                  </div>
                  <p className="text-sm text-neutral-300">{tier.description}</p>

                  <ul className="space-y-2 pt-4 border-t border-neutral-800 text-xs text-neutral-300">
                    {tier.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link href={`/contact?service=commission&tier=${tier.id}`}>
                  <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold flex items-center justify-center gap-2">
                    Đặt vẽ gói này <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Terms of Service & Copyright Section */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-amber-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">
                Điều khoản & Quy định bản quyền (Terms of Service)
              </h2>
              <p className="text-xs text-neutral-400">
                Vui lòng đọc kĩ các quy định trước khi gửi thông tin Commission.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-neutral-300">
            <div className="space-y-2 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
              <h4 className="font-bold text-amber-400">1. Quy định thanh toán & Đặt cọc</h4>
              <p className="text-xs leading-relaxed text-neutral-400">
                Thanh toán cọc 50% sau khi thống nhất Brief/Sketch ban đầu. 50% còn lại thanh toán khi tác phẩm hoàn thiện trước khi nhận file chất lượng cao.
              </p>
            </div>

            <div className="space-y-2 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
              <h4 className="font-bold text-amber-400">2. Bản quyền thương mại (Commercial Rights)</h4>
              <p className="text-xs leading-relaxed text-neutral-400">
                Giá trên áp dụng cho mục đích cá nhân (Personal Use). Nếu tác phẩm sử dụng cho mục đích Thương mại (Bìa sách in ấn, Merchandise), phí bản quyền bổ sung +50% - 100%.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
