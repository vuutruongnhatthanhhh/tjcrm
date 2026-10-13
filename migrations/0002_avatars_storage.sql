-- Bucket lưu ảnh đại diện người dùng (đã convert sang webp phía server
-- trước khi upload). Ghi/xoá object chỉ thực hiện qua service role trong
-- API route /api/profile/avatar nên không cần thêm policy cho
-- storage.objects — tương tự cách TJDiscipline xử lý species-images.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', TRUE, 2097152, ARRAY['image/webp'])
ON CONFLICT (id) DO NOTHING;
