-- Nhân viên thuộc về một công ty cụ thể. Mọi thành viên của công ty (không
-- chỉ chủ sở hữu) đều được xem/thêm/sửa/xóa — đây là dữ liệu vận hành
-- chung của cả nhóm, không như companies (chỉ chủ sở hữu mới sửa được).

CREATE TABLE IF NOT EXISTS employees (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id     UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  employee_code  TEXT NOT NULL DEFAULT '',
  full_name      TEXT NOT NULL,
  email          TEXT NOT NULL DEFAULT '',
  phone          TEXT NOT NULL DEFAULT '',
  department     TEXT NOT NULL DEFAULT '',
  role           TEXT NOT NULL DEFAULT '',
  status         TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'on_leave', 'inactive')),
  join_date      DATE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS employees_company_id_idx ON employees(company_id);

ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members_select_employees" ON employees
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM company_members
      WHERE company_members.company_id = employees.company_id
        AND company_members.user_id = auth.uid()
    )
  );

CREATE POLICY "members_insert_employees" ON employees
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM company_members
      WHERE company_members.company_id = employees.company_id
        AND company_members.user_id = auth.uid()
    )
  );

CREATE POLICY "members_update_employees" ON employees
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM company_members
      WHERE company_members.company_id = employees.company_id
        AND company_members.user_id = auth.uid()
    )
  );

CREATE POLICY "members_delete_employees" ON employees
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM company_members
      WHERE company_members.company_id = employees.company_id
        AND company_members.user_id = auth.uid()
    )
  );

CREATE OR REPLACE FUNCTION set_employees_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS employees_set_updated_at ON employees;
CREATE TRIGGER employees_set_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW EXECUTE FUNCTION set_employees_updated_at();
