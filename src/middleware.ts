import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/dal/dal';

export default async function middleware(req: NextRequest) {
	if (req.nextUrl.pathname.startsWith('/api')) {
		const token = req.headers.get('Authorization')?.split(' ')[1];

		const session = await verifySession(String(token));

		if (!session) {
			return new Response(null, { status: 401 });
		}

		const headers = new Headers(req.headers);
		headers.set('username', String(session.userName));

		//return headers with username value
		return NextResponse.next({
			request: {
				headers,
			},
		});
	} else {
		// 1. Specify protected and public routes
		const protectedRoutes = ['/account', '/profile'];
		const protectedDynamicRoutes = ['speloverzicht', 'room', 'profile'];
		const publicRoutes = ['/login', '/registreer', '/'];

		// 2. Check if the current route is protected or public
		const path = req.nextUrl.pathname;
		const isProtectedRoute = protectedRoutes.includes(path);
		const isProtectedDynamicRoutes = protectedDynamicRoutes.includes(path.split('/')[1]);
		const isPublicRoute = publicRoutes.includes(path);

		// 3. Decrypt the session from the cookie
		const cookie = (await cookies()).get('session')?.value;
		const session = await decrypt(cookie);

		// 4. Redirect to /login if the user is not authenticated
		if ((isProtectedRoute && !session?.userName) || (isProtectedDynamicRoutes && !session?.userName)) {
			console.log(req.nextUrl)
			console.log(req.nextUrl.origin);
			return NextResponse.redirect(new URL('/login', req.nextUrl.origin));
		}

		// 5. Redirect to /speloverzicht if the user is authenticated
		if (
			isPublicRoute &&
			session?.userName &&
			!req.nextUrl.pathname.startsWith('/speloverzicht')
		) {
			return NextResponse.redirect(
				new URL('/speloverzicht', req.nextUrl)
			);
		}
	}

	return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
	matcher: [
		'/((?!api/user/login|api/user/register|_next/static|_next/image|.*\\.png$).*)',
	],
};