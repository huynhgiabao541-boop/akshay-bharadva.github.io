# **TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM (SRS)**

**Dự án:** Illustration Student Portfolio Platform (Web Portfolio cho Sinh viên Ngành Thiết kế Minh họa)

**Phiên bản:** 1.0

## **1\. Giới thiệu (Introduction)**

### **1.1. Mục đích**

Tài liệu này xác định các yêu cầu chức năng (Functional Requirements) và phi chức năng (Non-Functional Requirements) cho hệ thống Website Portfolio cá nhân dành cho sinh viên ngành Thiết kế Minh họa (Illustration). Hệ thống giúp sinh viên trưng bày tác phẩm visual chất lượng cao, chia sẻ quy trình sáng tác (sketching, coloring, line art), kết nối với nhà tuyển dụng, art director và khách hàng freelance.

### **1.2. Phạm vi hệ thống**

Hệ thống gồm 2 thành phần chính:

* **Public Client Web:** Giao diện công khai dành cho khách hàng, nhà tuyển dụng, art director xem sản phẩm, tải CV, phóng to tác phẩm chi tiết và gửi liên hệ/đặt hoa hồng vẽ (commission).  
*   
* **Admin Dashboard (CMS):** Giao diện quản trị cá nhân cho sinh viên tự quản lý dự án, gắn nhãn thể loại, tải lên tranh ảnh/video, quản lý tệp tin đa phương tiện và theo dõi tin nhắn liên hệ.  
* 

### **1.3. Đối tượng người dùng (User Personas)**

* **Guest / Recruiter / Client:** Người xem tranh, tìm kiếm họa sĩ minh họa, tải portfolio PDF/CV, liên hệ hợp tác hoặc đặt vẽ commission.  
*   
* **Student / Illustrator (Admin):** Chủ sở hữu website, thực hiện các thao tác thêm/sửa/xóa tác phẩm, tùy chỉnh thông tin cá nhân và quản lý form liên hệ.  
* 

## **2\. Mô tả tổng quan hệ thống (Overall Description)**

### **2.1. Bối cảnh sản phẩm**

Khác với portfolio lập trình hay thiết kế UX/UI thông thường, portfolio minh họa yêu cầu:

* Trải nghiệm thị giác tối đa (Visual-first): Hỗ trợ ảnh kích thước lớn, độ sắc nét cao nhưng phải tối ưu tốc độ tải.  
*   
* Trưng bày quá trình sáng tạo (Art Process): So sánh Before/After (Sketch vs Final Render), quy trình phân lớp.  
*   
* Bảo vệ bản quyền (Art Protection): Hạn chế sao chép trái phép, hỗ trợ watermark hoặc gắn metadata bản quyền.  
* 

### **2.2. Kiến trúc tổng quát**

\[ Client Browser (Next.js / React) \]   
                 │ (REST API / GraphQL)  
\[ Backend Server (.NET Core / Node.js API) \]   
                 │  
  ┌──────────────┴──────────────┐  
  ▼                             ▼  
\[ Database (PostgreSQL/MongoDB) \]  \[ Cloud Storage \+ CDN (Cloudinary/S3) \]

## **3\. Yêu cầu chức năng (Functional Requirements)**

### **3.1. Phân hệ Client (Public Web)**

| Mã | Chức năng | Mô tả chi tiết |
| :---- | :---- | :---- |
| **FR-CLI-01** | **Hero & Artist Branding** | Hiển thị tên nghệ danh (Artist name), tagline định vị phong cách (VD: *Children's Book Illustrator, Concept Artist*), avatar cá nhân/art-persona và CTA chính (*"Xem tác phẩm"*, *"Liên hệ"*). |
| **FR-CLI-02** | **Gallery Grid & Filtering** | Lưới hiển thị tác phẩm (hỗ trợ Masonry layout hoặc Grid cân bằng). Cho phép lọc nhanh theo tag/thể loại: *2D Illustration, Character Concept, Book Cover, Editorial, Comic/Manga, Personal Works*. |
| **FR-CLI-03** | **Interactive Image Viewer (Lightbox)** | Bấm vào hình để mở chế độ xem toàn màn hình (Full-screen Lightbox), hỗ trợ **Deep Zoom** (phóng to cực đại 200% \- 400% để xem chi tiết nét vẽ/brush strokes mà không vỡ hạt), chuyển ảnh kế tiếp bằng phím mũi tên hoặc vuốt (swipe). |
| **FR-CLI-04** | **Project Case Study Detail** | Trang chi tiết dự án minh họa bao gồm: \- Tên dự án, năm hoàn thành, phần mềm sử dụng (Photoshop, Clip Studio Paint, Procreate...). \- **Process Showcase**: Hiển thị ảnh quy trình từng bước (Thumbnail $\\rightarrow$ Sketch $\\rightarrow$ Lineart $\\rightarrow$ Color Base $\\rightarrow$ Final Lighting). \- **Before/After Slider**: Thanh trượt so sánh bản phác thảo và tranh hoàn thiện. \- Bảng màu chủ đạo (Color Palette breakdown).  |
| **FR-CLI-05** | **About the Artist & Resume** | Giới thiệu tiểu sử, phong cách nghệ thuật cá nhân, các công cụ thành thạo (Hardware: Wacom, iPad; Software: Procreate, PTS...), danh sách triển lãm/giải thưởng đạt được tại trường đại học. Nút tải trực tiếp file PDF CV / Artbook tóm tắt. |
| **FR-CLI-06** | **Commission Guide & Price Sheet** | Trang/khối hiển thị bảng giá và quy định nhận vẽ freelance (Commission Info): Bảng phân loại giá (*Headshot, Half-body, Full-body, Background Detail*), các điều khoản bản quyền cá nhân/thương mại (Terms of Service). |
| **FR-CLI-07** | **Inquiry & Commission Form** | Form liên hệ có kiểm tra dữ liệu đầu vào (Validation): Họ tên, Email, Loại dịch vụ (*Tuyển dụng, Freelance, Commission*), Mô tả yêu cầu dự án, File đính kèm mẫu brief/reference (hỗ trợ file zip/png/pdf \< 15MB). Tích hợp reCAPTCHA v3. |
| **FR-CLI-08** | **Social Link Tree & Art Shop Link** | Liên kết trực tiếp đến các trang mạng xã hội hội họa: Behance, ArtStation, Instagram, Pixiv, Twitter/X, Inprnt (nếu có bán print tranh). |

### **3.2. Phân hệ Admin Dashboard (CMS)**

| Mã | Chức năng | Mô tả chi tiết |
| :---- | :---- | :---- |
| **FR-ADM-01** | **Authentication & Security** | Đăng nhập đơn người dùng bằng Email/Mật khẩu hoặc OAuth2, hỗ trợ phiên làm việc bảo mật bằng JWT và Refresh Token. |
| **FR-ADM-02** | **Project & Art Asset Management** | \- Tạo mới, chỉnh sửa, xóa, ẩn/hiện dự án. \- Tải lên nhiều ảnh cùng lúc (Multi-upload), tự động nén và tạo thumbnail tối ưu. \- Sắp xếp thứ tự hiển thị bằng cơ chế kéo thả (Drag & Drop sorting). \- Gắn nhãn thể loại, công cụ thực hiện, ngày tạo.  |
| **FR-ADM-03** | **Process & Asset Layering Editor** | Thiết lập các ảnh con thuộc quy trình sáng tác của dự án (Sketch, Lineart, Final) để hiển thị lên Slider Before/After hoặc Gallery quy trình. |
| **FR-ADM-04** | **Commission & Pricing Settings** | Bật/tắt trạng thái nhận việc (*Available for work / Closed*), cập nhật bảng giá vẽ, sửa đổi điều khoản sử dụng. |
| **FR-ADM-05** | **Inquiry Management Inbox** | Xem danh sách tin nhắn gửi về từ Contact Form, lọc theo trạng thái (*Chưa đọc, Đã phản hồi, Đã đóng*), xem nội dung brief và tải file đính kèm. |
| **FR-ADM-06** | **Basic Traffic Analytics** | Bảng tóm tắt số lượt xem portfolio theo ngày/tuần, danh sách tác phẩm được click xem/zoom nhiều nhất. |

## **4\. Yêu cầu phi chức năng (Non-Functional Requirements)**

### **4.1. Hiệu năng & Tối ưu Media (Performance)**

* **Image Compression & Modern Formats:** Hệ thống bắt buộc tự động chuyển đổi ảnh tải lên sang định dạng .webp hoặc .avif với độ nén tối ưu dung lượng nhưng bảo toàn sắc độ màu.  
*   
* **Lazy Loading & Blur-up Placeholder:** Mọi hình ảnh danh mục chỉ tải khi cuộn tới vùng nhìn (viewport), hiển thị hiệu ứng mờ (Low-Quality Image Placeholder) trong lúc chờ tải dữ liệu gốc.  
*   
* **Tốc độ phản hồi:** Điểm Google PageSpeed Insights đạt $\\ge 85$ trên mobile và $\\ge 95$ trên desktop; thời gian tải khung nhìn đầu tiên (FCP) $\< 1.5$ giây.  
* 

### **4.2. Khả năng tương thích & Giao diện (Usability & Responsiveness)**

* **Color Accuracy:** Đảm bảo xuất chuẩn màu sRGB cho toàn bộ ảnh hiển thị để màu tranh vẽ không bị lệch sắc thái khi duyệt trên các màn hình Retina / OLED khác nhau.  
*   
* **Responsive Layout:** Tối ưu hóa toàn diện cho 3 độ phân giải chuẩn: Mobile ($\<768\\text{px}$), Tablet ($768\\text{px} \- 1024\\text{px}$), Desktop ($\\ge 1024\\text{px}$ và màn hình lớn $2\\text{K}/4\\text{K}$).  
* 

### **4.3. Bảo vệ bản quyền nghệ thuật cơ bản (Art Protection)**

* Tùy chọn vô hiệu hóa chuột phải (Disable right-click context menu) và chặn kéo thả ảnh (dragstart prevent) trên trang xem công khai.  
*   
* Tự động chèn Watermark mờ hoặc chữ ký tác giả góc ảnh khi xuất bản (tùy chỉnh bật/tắt trong CMS).  
* 

### **4.4. Tối ưu hóa công cụ tìm kiếm & Chia sẻ (SEO & Open Graph)**

* Tự động gán thẻ Open Graph (OG Image, OG Title, Description) cho từng link dự án để khi chia sẻ lên mạng xã hội/Discord, hình thu nhỏ của tranh vẽ hiển thị đúng tỉ lệ và sắc nét.  
*   
* Cấu trúc dữ liệu chuẩn Schema.org (Person, VisualArtwork).  
* 

## **5\. Mô hình Dữ liệu Cốt lõi (Data Model Schema)**

\[ CATEGORY \]  
  ├── Id (PK, UUID)  
  ├── Name (String)  
  └── Slug (String)

\[ PROJECT \]  
  ├── Id (PK, UUID)  
  ├── CategoryId (FK \-\> CATEGORY.Id)  
  ├── Title (String)  
  ├── Slug (String)  
  ├── Description (Text/Markdown)  
  ├── ThumbnailUrl (String)  
  ├── SoftwareUsed (Array of Strings)  
  ├── IsFeatured (Boolean)  
  ├── DisplayOrder (Integer)  
  ├── CreatedDate (DateTime)  
  └── Status (Draft / Published)

\[ PROJECT\_IMAGE \]  
  ├── Id (PK, UUID)  
  ├── ProjectId (FK \-\> PROJECT.Id)  
  ├── ImageUrl (String)  
  ├── ImageType (Thumbnail / Sketch / Lineart / Final / Detail)  
  ├── Width (Integer)  
  ├── Height (Integer)  
  └── OrderIndex (Integer)

\[ INQUIRY / COMMISSION \]  
  ├── Id (PK, UUID)  
  ├── SenderName (String)  
  ├── SenderEmail (String)  
  ├── ServiceType (String)  
  ├── Message (Text)  
  ├── AttachmentUrl (String, Nullable)  
  ├── IsRead (Boolean)  
  └── CreatedAt (DateTime)

## **6\. Gợi ý Công nghệ Triển khai (Tech Stack Recommendations)**

* **Frontend:** Next.js (App Router, Server-Side Rendering để tối ưu SEO và load ảnh), Tailwind CSS, Framer Motion (hiệu ứng chuyển cảnh mượt mà), Yet-Another-React-Lightbox (hỗ trợ Zoom/Pinch).  
*   
* **Backend:** ASP.NET Core Web API hoặc Node.js (Express / NestJS).  
*   
* **Media & CDN:** Cloudinary hoặc AWS S3 kết hợp Cloudflare CDN (Cloudinary hỗ trợ auto format WebP/AVIF và tự căn chỉnh scale màu cực tốt cho artist).  
*   
* **Database:** PostgreSQL hoặc SQLite (nếu cấu trúc gọn nhẹ dạng cá nhân).

