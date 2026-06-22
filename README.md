# La Doce Chapina — Catálogo Público

Catálogo público en tiempo real, conectado a la misma base de Supabase que ya usas
en tu sistema de inventario. Permite a tus clientes ver stock, tallas, productos en
camino, y abrir WhatsApp directamente con un mensaje prellenado — sin tocar tu
sistema interno.

## 1. Requisitos

- Node.js 18 o superior
- El mismo proyecto de Supabase que ya usas (URL + anon key)
- Tu número de WhatsApp de negocio (con código de país, solo números)

## 2. Migración de base de datos

Antes de correr el proyecto, ejecuta **una sola vez** el archivo
`supabase/migration.sql` en tu Supabase → SQL Editor. Esto agrega:

- `team`, `description`, `image_url` a la tabla `products`
- `stock_incoming` a la tabla `product_sizes`
- una tabla nueva `catalog_leads` (solo de lectura para ti, solo inserción
  pública) para que puedas ver qué productos/tallas consultan tus clientes

No borra ni modifica nada de tu app de inventario actual.

## 3. Configurar variables de entorno

Copia `.env.local.example` a `.env.local` y completa:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
NEXT_PUBLIC_WHATSAPP_NUMBER=50212345678
```

> La anon key es segura para el navegador — es de solo lectura para el catálogo
> gracias a las políticas RLS que agrega la migración.

## 4. Instalar y correr en desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000/catalogo](http://localhost:3000/catalogo)

## 5. Cómo administrar el catálogo

Todo se administra desde Supabase → Table Editor, sin tocar código:

| Campo                    | Tabla            | Qué controla                          |
|---------------------------|------------------|----------------------------------------|
| `name`, `sku`, `category`| `products`       | Nombre y categoría del producto        |
| `team`                   | `products`       | Equipo o selección (filtro)            |
| `description`           | `products`       | Descripción corta en la tarjeta        |
| `image_url`              | `products`       | Foto del producto (link público)       |
| `sale_price`             | `products`       | Precio mostrado                        |
| `active`                 | `products`       | `false` = no aparece en el catálogo    |
| `stock_available`        | `product_sizes`  | Unidades físicas listas para entregar  |
| `stock_incoming`         | `product_sizes`  | Unidades en camino (reservables)       |

El estado (`Disponible`, `Últimas unidades`, `En camino`, `Agotado`) se calcula
automáticamente — no hay que escribirlo manualmente.

Las fotos: sube la imagen a Supabase Storage (o cualquier hosting de imágenes)
y pega el link público en `image_url`.

## 6. Desplegar a producción

Este proyecto usa Next.js, así que la forma más simple es **Vercel** (gratis para
este tamaño de proyecto):

1. Sube esta carpeta a un repositorio de GitHub
2. Ve a [vercel.com](https://vercel.com) → **Add New Project** → importa el repo
3. En **Environment Variables**, agrega las mismas 3 variables de `.env.local`
4. Clic en **Deploy**

En unos minutos tendrás una URL como `la-doce-chapina.vercel.app`. Puedes conectar
tu propio dominio desde Vercel → Settings → Domains.

> Nota: a diferencia de tu app de inventario (un solo archivo HTML que subes a
> Netlify arrastrando), este es un proyecto Next.js que necesita un paso de build
> (`npm run build`) — por eso usamos Vercel, que está hecho específicamente para
> este tipo de proyecto y lo construye automáticamente en cada cambio.

## 7. Tiempo real

El catálogo se suscribe a cambios en `products` y `product_sizes` vía Supabase
Realtime. Cuando registras una venta en tu sistema de inventario y el stock baja,
o cuando creas/archivas un producto, el catálogo público se actualiza solo, sin
que el cliente recargue la página.

## Estructura del proyecto

```
app/
  catalogo/page.tsx     → página principal del catálogo
  stock/page.tsx        → mismo catálogo, alias /stock
  layout.tsx            → fuentes de marca (Anton + Open Sans)
components/
  Header.tsx            → marca + marcador en vivo
  SearchBar.tsx
  FilterBar.tsx          → talla, equipo, disponibilidad, tipo
  ProductGrid.tsx
  ProductCard.tsx        → tarjeta de producto + selector de talla + WhatsApp
  StatusBadge.tsx
  WhatsAppButton.tsx
  Footer.tsx
lib/
  supabase.ts            → cliente de Supabase (solo lectura + insert de leads)
  types.ts
  utils.ts               → cálculo de estado, formato de precio, link de WhatsApp
supabase/
  migration.sql
```
