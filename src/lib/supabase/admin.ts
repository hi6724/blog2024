import 'server-only';
import { createClient } from '@supabase/supabase-js';

// Custom username/password accounts are authenticated by server actions.
// Never import this client into a client component or expose its key.
export function createSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('댓글 서비스 연결 설정을 확인해주세요.');
  if (key === process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('댓글 서비스의 서버용 API 키 설정을 확인해주세요.');
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }) },
  });
}
