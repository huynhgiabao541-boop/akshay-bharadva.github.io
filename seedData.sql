-- ============================================================
-- PORTFOLIO SEED (multi-page) — Pages + Projects (70/30 mix)
-- Schema: portfolio_sections + portfolio_items + site_identity
-- ============================================================

BEGIN;

-- ============================================================
-- 0) site_identity (upsert row id=1)
-- ============================================================
INSERT INTO site_identity (id, user_id, profile_data, social_links, footer_data, portfolio_mode, updated_at)
VALUES
(
  1,
  auth.uid(),
  '{
    "name": "Văn Lang Illustrator",
    "title": "Illustration Student & Digital Artist | Van Lang University",
    "bio": "Portfolio seed data (70% digital, 30% traditional). Mình tập trung illustration, character design, editorial và một phần watercolor/ink studies.",
    "status_panel": {
      "show": true,
      "design": "minimal",
      "title": "Trạng thái nghệ thuật",
      "availability": "Nhận vẽ minh hoạ Freelance / Collab",
      "currentlyExploring": { "title": "Đang học", "items": ["Digital watercolor", "Lighting studies", "Character expressions"] }
    },
    "navLinks": [
      { "label": "Home", "href": "/" },
      { "label": "Showcase", "href": "/showcase" },
      { "label": "About", "href": "/about" },
      { "label": "Projects", "href": "/projects" },
      { "label": "Contact", "href": "/contact" }
    ]
  }'::jsonb,
  '[
    { "id": "ig", "label": "Instagram", "url": "https://instagram.com/vanlang.illustrator", "is_visible": true },
    { "id": "be", "label": "Behance", "url": "https://behance.net/vanlangillustrator", "is_visible": true },
    { "id": "mail", "label": "Email", "url": "mailto:hello@example.com", "is_visible": true }
  ]'::jsonb,
  '{ "copyright_text": "© 2026 Văn Lang Illustrator. All rights reserved." }'::jsonb,
  'multi-page',
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  user_id = EXCLUDED.user_id,
  profile_data = EXCLUDED.profile_data,
  social_links = EXCLUDED.social_links,
  footer_data = EXCLUDED.footer_data,
  portfolio_mode = EXCLUDED.portfolio_mode,
  updated_at = NOW();

-- ============================================================
-- 1) PAGES: portfolio_sections
-- ============================================================

-- HOME (/)
INSERT INTO portfolio_sections (user_id, title, type, content, display_order, page_path, layout_style, is_visible)
VALUES
(auth.uid(), 'Hero', 'markdown',
'## Văn Lang Illustrator
*Mình là sinh viên Minh hoạ — mix 70% Digital + 30% Traditional.*

**Mình làm:** character design, editorial illustration, key visual, watercolor/ink studies.

- Xem tác phẩm: /projects
- Bảng giá đặt vẽ: /commission
- Liên hệ: /contact
', 0, '/', 'default', true),

(auth.uid(), 'Featured Projects', 'list_items', 'Các project nổi bật (case study).', 1, '/', 'default', true),
(auth.uid(), 'Skills & Tools', 'list_items', 'Kỹ năng & công cụ mình hay dùng.', 2, '/', 'default', true),
(auth.uid(), 'Mini Gallery', 'gallery', 'Một vài hình ảnh chọn lọc.', 3, '/', 'default', true)
ON CONFLICT DO NOTHING;

-- ABOUT (/about)
INSERT INTO portfolio_sections (user_id, title, type, content, display_order, page_path, layout_style, is_visible)
VALUES
(auth.uid(), 'About Intro', 'markdown',
'## About
Mình yêu thích kể chuyện bằng hình ảnh, đặc biệt là ánh sáng, chất liệu và biểu cảm nhân vật.
Mục tiêu: xây dựng portfolio đủ mạnh để xin internship/freelance illustration.
', 0, '/about', 'default', true),
(auth.uid(), 'Education', 'list_items', 'Học vấn & hoạt động.', 1, '/about', 'default', true),
(auth.uid(), 'Skills', 'list_items', 'Kỹ năng chính.', 2, '/about', 'default', true),
(auth.uid(), 'Tools & Medium', 'list_items', 'Digital + Traditional.', 3, '/about', 'default', true),
(auth.uid(), 'Download CV', 'markdown',
'## CV
Tải CV (PDF): https://example.com/cv.pdf
Email: mailto:hello@example.com
', 4, '/about', 'default', true)
ON CONFLICT DO NOTHING;

-- PROJECTS (/projects)
INSERT INTO portfolio_sections (user_id, title, type, content, display_order, page_path, layout_style, is_visible)
VALUES
(auth.uid(), 'Projects Intro', 'markdown',
'## Projects
Mỗi project gồm: brief → concept → process → final → learnings.
', 0, '/projects', 'default', true),
(auth.uid(), 'Filters Hint', 'markdown',
'Gợi ý filter: Digital / Traditional • Editorial • Character • Poster/Key Visual • Mascot
', 1, '/projects', 'default', true)
ON CONFLICT DO NOTHING;

-- SHOWCASE (/showcase)
INSERT INTO portfolio_sections (user_id, title, type, content, display_order, page_path, layout_style, is_visible)
VALUES
(auth.uid(), 'Showcase Intro', 'markdown',
'## Showcase
Một số series & studies (đặc biệt là Traditional).
', 0, '/showcase', 'default', true),
(auth.uid(), 'Traditional Gallery', 'gallery', 'Watercolor & Ink studies.', 1, '/showcase', 'default', true)
ON CONFLICT DO NOTHING;

-- CONTACT (/contact)
INSERT INTO portfolio_sections (user_id, title, type, content, display_order, page_path, layout_style, is_visible)
VALUES
(auth.uid(), 'Contact Intro', 'markdown',
'## Contact
Nếu bạn muốn collab / freelance / commission, hãy gửi brief và deadline mong muốn.
', 0, '/contact', 'default', true),
(auth.uid(), 'Contact Methods', 'list_items', 'Các kênh liên hệ.', 1, '/contact', 'default', true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 2) PAGES: portfolio_items (Home/About/Showcase/Contact)
-- ============================================================

-- HOME: Featured Projects (links to project detail routes)
INSERT INTO portfolio_items (section_id, user_id, title, subtitle, description, image_url, link_url, tags, display_order)
SELECT s.id, auth.uid(), x.title, x.subtitle, x.description, x.image_url, x.link_url, x.tags, x.display_order
FROM portfolio_sections s
JOIN (
VALUES
('The Lantern City (Capstone)', 'Key Visual • Digital', 'Case study đầy đủ: moodboard → sketch → color keys → final.', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop', '/projects/lantern-city-capstone', ARRAY['Digital','Fantasy','Lighting','Environment'], 0),
('Mind & Music (Editorial)', 'Editorial • Digital', 'Minh hoạ set 4–6 ảnh cho bài viết về âm nhạc & tâm trạng.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop', '/projects/mind-and-music-editorial', ARRAY['Digital','Editorial','Minimal'], 1),
('Character Sheet — 3 Heroes', 'Character Design • Digital', 'Silhouette → lineup → turnaround → expressions.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop', '/projects/character-sheet-3-heroes', ARRAY['Digital','Character','Expressions'], 2),
('Tea Shop Mascot & Stickers', 'Mascot • Digital', 'Iteration mascot + mockup ứng dụng (cup/menu/sticker).', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=800&auto=format&fit=crop', '/projects/tea-shop-mascot', ARRAY['Digital','Branding','Cute'], 3),
('Watercolor Postcards (Series)', 'Series • Traditional', '6–12 postcard màu nước, tập trung phối màu & texture.', 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop', '/projects/watercolor-postcards-series', ARRAY['Traditional','Watercolor','Nature'], 4),
('Ink Studies — Faces & Hands', 'Studies • Traditional', 'Sketchbook studies: nét, form, biểu cảm.', 'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?q=80&w=800&auto=format&fit=crop', '/projects/ink-studies-faces-hands', ARRAY['Traditional','Ink','Portrait'], 5)
) AS x(title, subtitle, description, image_url, link_url, tags, display_order)
ON TRUE
WHERE s.page_path = '/' AND s.title = 'Featured Projects';

-- HOME: Skills & Tools
INSERT INTO portfolio_items (section_id, user_id, title, subtitle, description, tags, display_order)
SELECT s.id, auth.uid(), x.title, x.subtitle, x.description, x.tags, x.display_order
FROM portfolio_sections s
JOIN (
VALUES
('Illustration', NULL, 'Editorial / Book / Key Visual', ARRAY['skill'], 0),
('Character Design', NULL, 'Silhouette, turnaround, expressions', ARRAY['skill'], 1),
('Color & Lighting', NULL, 'Color keys, mood, texture', ARRAY['skill'], 2),
('Procreate', 'Digital tool', NULL, ARRAY['tool','digital'], 3),
('Photoshop', 'Digital tool', NULL, ARRAY['tool','digital'], 4),
('Watercolor', 'Traditional medium', NULL, ARRAY['tool','traditional'], 5),
('Ink', 'Traditional medium', NULL, ARRAY['tool','traditional'], 6)
) AS x(title, subtitle, description, tags, display_order)
ON TRUE
WHERE s.page_path = '/' AND s.title = 'Skills & Tools';

-- ABOUT: Education
INSERT INTO portfolio_items (section_id, user_id, title, subtitle, date_from, date_to, description, tags, display_order)
SELECT s.id, auth.uid(), x.title, x.subtitle, x.date_from, x.date_to, x.description, x.tags, x.display_order
FROM portfolio_sections s
JOIN (
VALUES
('Van Lang University', 'Illustration / Visual Design', '2024', '2027', 'BFA track (seed demo).', ARRAY['education'], 0),
('Personal Projects', 'Series & studies', '2025', NULL, 'Watercolor postcards, ink studies, editorial sets.', ARRAY['education'], 1)
) AS x(title, subtitle, date_from, date_to, description, tags, display_order)
ON TRUE
WHERE s.page_path = '/about' AND s.title = 'Education';

-- CONTACT: Contact Methods
INSERT INTO portfolio_items (section_id, user_id, title, subtitle, link_url, display_order)
SELECT s.id, auth.uid(), x.title, x.subtitle, x.link_url, x.display_order
FROM portfolio_sections s
JOIN (
VALUES
('Email', 'hello@example.com', 'mailto:hello@example.com', 0),
('Instagram', '@vanlang.illustrator', 'https://instagram.com/vanlang.illustrator', 1),
('Behance', 'vanlangillustrator', 'https://behance.net/vanlangillustrator', 2),
('Download CV', 'PDF', 'https://example.com/cv.pdf', 3)
) AS x(title, subtitle, link_url, display_order)
ON TRUE
WHERE s.page_path = '/contact' AND s.title = 'Contact Methods';

-- ============================================================
-- 3) PROJECT DETAIL PAGES: portfolio_sections
-- ============================================================

INSERT INTO portfolio_sections (user_id, title, type, content, display_order, page_path, layout_style, is_visible)
VALUES
(auth.uid(), 'Project Header', 'markdown',
'## The Lantern City (Capstone)
Category: Key Visual / Poster  
Medium: Digital (Procreate + Photoshop)  
Year: 2026  
Tags: Fantasy, Lighting, Environment
Project tập trung vào ánh sáng, không khí và storytelling qua bối cảnh.
', 0, '/projects/lantern-city-capstone', 'default', true),
(auth.uid(), 'Brief', 'markdown',
'## Brief
Thiết kế key visual cho một thành phố giả tưởng về đêm, nơi ánh đèn lồng là “ngôn ngữ” dẫn đường.
Deliverables: 1 key visual chính + 2 crop dùng cho social.
', 1, '/projects/lantern-city-capstone', 'default', true),
(auth.uid(), 'Learnings', 'markdown',
'## Learnings
Khóa mood bằng color keys sớm.
Test readability ở thumbnail trước khi render chi tiết.
', 2, '/projects/lantern-city-capstone', 'default', true)
ON CONFLICT DO NOTHING;

COMMIT;
