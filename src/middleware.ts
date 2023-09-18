import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import type { NextApiRequest, NextApiResponse } from 'next';
import * as jose from "jose"
import { web3AuthInstance } from '@/src/hooks';

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  const idToken = req.headers.get("Authorization")?.split(' ')[1];
  const publicAddress = (await req.json())["public_address"]

  if (idToken != undefined) {
    const jwks = jose.createRemoteJWKSet(new URL("https://authjs.web3auth.io/jwks"));
    try {
      const jwtDecoded = await jose.jwtVerify(idToken, jwks, { algorithms: ["ES256"] });

      if ((jwtDecoded.payload as any).wallets[0].address != publicAddress) {
        return NextResponse.json({ message: `${publicAddress}: 'Verification failed'` },
          { status: 401, headers: { 'content-type': 'application/json' } }
        )
      }
    } catch (error) {
      return NextResponse.json({ message: `${publicAddress}: 'Verification failed'` },
        { status: 401, headers: { 'content-type': 'application/json' } }
      )
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/api/quest/:path*',
}