import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cliente único compartido en todo el catálogo público.
// Solo se usa para SELECT (lectura) y para insertar leads de pre-reserva.
// Nunca se usa para modificar productos ni stock desde el navegador.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: { eventsPerSecond: 5 },
  },
});
