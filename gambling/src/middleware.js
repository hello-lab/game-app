import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req) {
    const token = req.cookies.get('token');
    const secretKey = new TextEncoder().encode(process.env.SECRET_KEY);

    if (!token) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    try {
        console.log(token.value);
        await jwtVerify(token.value, secretKey);
        return NextResponse.next();
    } catch (error) {
        console.log(error);
        return NextResponse.redirect(new URL('/', req.url));
    }
}

export const config = {
    matcher: ['/app/:path*'],
};
