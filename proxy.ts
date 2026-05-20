import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ESCLUSIONE: Non bloccare file statici, manifest, icone o file di sistema
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/manifest.json') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.svg')
  ) {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return req.cookies.get(name)?.value; },
        set(name: string, value: string, options: any) { res.cookies.set(name, value, options); },
        remove(name: string, options: any) { res.cookies.delete(name); },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  // Protezione rotte
  if (!session && (pathname.startsWith('/admin') || pathname.startsWith('/map'))) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}
