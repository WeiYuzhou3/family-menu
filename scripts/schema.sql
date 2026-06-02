-- Family Menu Database Schema
-- Run this in the Supabase SQL Editor to set up tables.

-- ── Enable UUID generation ──
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Dishes ──
CREATE TABLE dishes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  category        TEXT NOT NULL CHECK (category IN (
                    'main', 'side', 'soup', 'breakfast', 'dessert', 'beverage'
                  )),
  description     TEXT,
  image_url       TEXT,
  ingredients     JSONB NOT NULL DEFAULT '[]'::jsonb,
  instructions    TEXT NOT NULL DEFAULT '',
  cooking_time    INTEGER,
  difficulty      TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  is_available    BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Orders ──
CREATE TABLE orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'preparing', 'completed', 'cancelled')),
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Order Items ──
CREATE TABLE order_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  dish_id         UUID NOT NULL REFERENCES dishes(id) ON DELETE CASCADE,
  quantity        INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  special_requests TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── App Passwords ──
CREATE TABLE app_passwords (
  id              SERIAL PRIMARY KEY,
  role            TEXT UNIQUE NOT NULL CHECK (role IN ('wife', 'husband')),
  password_hash   TEXT NOT NULL,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Updated At Trigger ──
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_dishes_updated_at
  BEFORE UPDATE ON dishes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_app_passwords_updated_at
  BEFORE UPDATE ON app_passwords
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Storage Bucket ──
-- Create bucket "dish-images" via Supabase Dashboard > Storage
-- Set as "public" bucket for read access
