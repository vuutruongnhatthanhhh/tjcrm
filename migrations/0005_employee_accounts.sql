-- Cho phép liên kết một nhân viên với tài khoản đăng nhập thật (được mời
-- qua admin.generateLink({type:"invite"}), không bắt buộc — nhân viên
-- chưa có tài khoản vẫn là một hàng dữ liệu bình thường với user_id NULL.

ALTER TABLE employees ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS employees_user_id_idx ON employees(user_id);
