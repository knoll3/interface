import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import * as jose from 'jose';
import { isStringObject } from 'util/types';

async function verifyByPublicKey(req: NextRequest, app_pub_key: any) {
  // passed from the frontend in the Authorization header
  const idToken = req.headers.get('Authorization')?.split(' ')[1];

  if (typeof idToken === 'string') {
    try {
      const jwksSocial = jose.createRemoteJWKSet(
        new URL('https://api.openlogin.com/jwks')
      );

      // Verify the JWT using Web3Auth's JWKS
      const jwtDecodedSocial = await jose.jwtVerify(idToken, jwksSocial, {
        algorithms: ['ES256'],
      });

      if (
        (jwtDecodedSocial.payload as any).wallets[0].public_key === app_pub_key
      ) {
        return true;
      }
    } catch (error) {
      console.error(error);
    }
  }
}

async function verifyByWalletAddress(req: NextRequest, wallet_Address: any) {
  // passed from the frontend in the Authorization header
  const idToken = req.headers.get('Authorization')?.split(' ')[1];

  if (typeof idToken === 'string') {
    const jwks = jose.createRemoteJWKSet(
      new URL('https://authjs.web3auth.io/jwks')
    );
    try {
      const jwtDecoded = await jose.jwtVerify(idToken, jwks, {
        algorithms: ['ES256'],
      });

      if ((jwtDecoded.payload as any).wallets[0].address == wallet_Address) {
        return true;
      }
    } catch (error) {
      console.error(error);
    }
  }
}

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  // passed from the frontend in the request body
  const auth_key = (await req.json())['auth_key'].toLocaleLowerCase();

  const isVerifiedPublicKey = await verifyByPublicKey(req, auth_key);
  const isVerifiedWalletAddress = await verifyByWalletAddress(req, auth_key);

  if (isVerifiedPublicKey || isVerifiedWalletAddress) {
    return NextResponse.next();
  }

  // in case of bypass through verifications, it might mean that no tokenId was received
  return NextResponse.json(
    { message: `${auth_key!}: 'Verification failed'` },
    { status: 401, headers: { 'content-type': 'application/json' } }
  );
}

export const config = {
  matcher: [
    '/api/quest/oauth/discord',
    '/api/quest/oauth/discordVerify',
    '/api/quest/oauth/twitterVerify',
    '/api/quest/login',
  ],
};
