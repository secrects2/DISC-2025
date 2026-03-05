-- ============================================================
-- DISC 测验系统 — Supabase 数据表初始化
-- 请在 Supabase Dashboard → SQL Editor 中运行此脚本
-- ============================================================

-- 1) 使用者表（管理员 + 网红 + 一般用户）
CREATE TABLE IF NOT EXISTS users (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username      TEXT UNIQUE NOT NULL,
  password      TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'influencer', 'user')),
  name          TEXT DEFAULT '',
  email         TEXT DEFAULT '',
  phone         TEXT DEFAULT '',
  dept          TEXT DEFAULT '',
  title         TEXT DEFAULT '',
  referral_code TEXT UNIQUE,         -- 网红专属推荐码
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- 2) 测验记录表
CREATE TABLE IF NOT EXISTS records (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at    TIMESTAMPTZ DEFAULT now(),
  taker_name    TEXT DEFAULT '',      -- 测验者姓名
  taker_phone   TEXT DEFAULT '',      -- 测验者电话
  taker_email   TEXT DEFAULT '',      -- 测验者邮箱
  org           TEXT DEFAULT '',      -- 组织
  dept          TEXT DEFAULT '',      -- 部门
  title         TEXT DEFAULT '',      -- 职称
  d_score       INTEGER DEFAULT 0,   -- D 分数 (0-100)
  i_score       INTEGER DEFAULT 0,   -- I 分数
  s_score       INTEGER DEFAULT 0,   -- S 分数
  c_score       INTEGER DEFAULT 0,   -- C 分数
  primary_type  TEXT DEFAULT '',      -- 主要人格类型 D/I/S/C
  referral_code TEXT DEFAULT '',      -- 来自哪个网红的推荐连结
  raw_scores    JSONB DEFAULT '{}'   -- 原始答题得分
);

-- 3) 索引
CREATE INDEX IF NOT EXISTS idx_records_referral ON records(referral_code);
CREATE INDEX IF NOT EXISTS idx_records_created  ON records(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_referral   ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_role       ON users(role);

-- 4) RLS 策略（允许 anon 完全访问 — 内部工具）
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE records ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='users' AND policyname='anon_full_users') THEN
    CREATE POLICY anon_full_users ON users FOR ALL TO anon USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='records' AND policyname='anon_full_records') THEN
    CREATE POLICY anon_full_records ON records FOR ALL TO anon USING (true) WITH CHECK (true);
  END IF;
END$$;

-- 5) 默认管理员帐号
INSERT INTO users (username, password, role, name)
VALUES ('admin', 'admin123', 'admin', '系统管理员')
ON CONFLICT (username) DO NOTHING;
