-- ════════════════════════════════════════════════════════════
-- Migración: Catálogo público La Doce Chapina
-- Ejecutar en Supabase → SQL Editor (proyecto existente)
-- Extiende las tablas actuales en lugar de crear un sistema paralelo.
-- ════════════════════════════════════════════════════════════

-- 1. Columnas nuevas en products (no afecta nada de tu app de inventario)
ALTER TABLE products ADD COLUMN IF NOT EXISTS team text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url text;

-- 2. Columna nueva en product_sizes: unidades en camino (reservables)
ALTER TABLE product_sizes ADD COLUMN IF NOT EXISTS stock_incoming int DEFAULT 0;

-- 3. Tabla de leads del catálogo público (consultas y pre-reservas)
--    Solo se puede INSERTAR desde el navegador del cliente.
--    Tú la revisas directamente en Supabase → Table Editor.
CREATE TABLE IF NOT EXISTS catalog_leads (
  id bigint generated always as identity primary key,
  product_id bigint references products(id),
  size text,
  type text default 'stock', -- 'stock' | 'pre_reserva'
  created_at timestamptz default now()
);

ALTER TABLE catalog_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_insert_only" ON catalog_leads
  FOR INSERT WITH CHECK (true);

-- 4. Lectura pública explícita de productos y tallas
--    (el catálogo nunca escribe en estas tablas desde el navegador)
CREATE POLICY "public_read_products" ON products
  FOR SELECT USING (true);

CREATE POLICY "public_read_sizes" ON product_sizes
  FOR SELECT USING (true);

-- ════════════════════════════════════════════════════════════
-- Nota: si quieres ocultar un producto del catálogo sin borrarlo
-- de tu inventario, usa la columna "active" que ya existe:
--   UPDATE products SET active = false WHERE id = ...;
-- El catálogo solo muestra productos con active = true.
-- ════════════════════════════════════════════════════════════
