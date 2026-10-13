-- Multi-tenant: một user có thể thuộc nhiều công ty. company_members là
-- bảng trung gian (nhiều-nhiều) giữa auth.users và companies, có role để
-- phân biệt chủ sở hữu (được sửa tên/avatar công ty) và thành viên.

CREATE TABLE IF NOT EXISTS companies (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  avatar_url  TEXT,
  created_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS company_members (
  company_id  UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role        TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (company_id, user_id)
);

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_members ENABLE ROW LEVEL SECURITY;

-- Mọi thành viên xem được công ty mình thuộc về; chỉ chủ sở hữu được sửa
-- (đổi tên / avatar). Tạo công ty (insert) và thêm thành viên (insert vào
-- company_members) chỉ thực hiện qua service role trong API route
-- /api/companies — tương tự cách TJDiscipline xử lý ghi dữ liệu admin.
CREATE POLICY "select_member_companies" ON companies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM company_members
      WHERE company_members.company_id = companies.id
        AND company_members.user_id = auth.uid()
    )
  );

CREATE POLICY "update_own_company" ON companies
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM company_members
      WHERE company_members.company_id = companies.id
        AND company_members.user_id = auth.uid()
        AND company_members.role = 'owner'
    )
  );

CREATE POLICY "select_own_memberships" ON company_members
  FOR SELECT USING (auth.uid() = user_id);

-- Giữ updated_at luôn mới sau mỗi lần sửa công ty.
CREATE OR REPLACE FUNCTION set_companies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS companies_set_updated_at ON companies;
CREATE TRIGGER companies_set_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION set_companies_updated_at();

-- Bucket lưu avatar công ty (đã convert sang webp phía server trước khi
-- upload, cùng kỹ thuật với avatar người dùng).
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('company-avatars', 'company-avatars', TRUE, 2097152, ARRAY['image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Tên doanh nghiệp giờ thuộc về company (một user có thể có nhiều công ty),
-- không còn là thuộc tính cố định trên hồ sơ cá nhân nữa.
ALTER TABLE profiles DROP COLUMN IF EXISTS company_name;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
