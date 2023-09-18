import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import * as jose from "jose"
import { isStringObject } from 'util/types'

async function verifyByPublicKey(req: NextRequest) {
  // passed from the frontend in the Authorization header
  const idToken = req.headers.get("Authorization")?.split(' ')[1]

  // passed from the frontend in the request body
  const app_pub_key = (await req.json())["user_key"]

  if (isStringObject(idToken)) {
    try {
      const jwksSocial = jose.createRemoteJWKSet(
        new URL('https://api.openlogin.com/jwks')
      );

      // Verify the JWT using Web3Auth's JWKS
      const jwtDecodedSocial = await jose.jwtVerify(idToken!, jwksSocial, {
        algorithms: ['ES256'],
      });

      if ((jwtDecodedSocial.payload as any).wallets[0].public_key === app_pub_key) {
        return NextResponse.next()
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { message: `${app_pub_key}: 'Verification failed'` },
        { status: 503, headers: { 'content-type': 'application/json' } })
    }
  }
}

async function verifyByWalletAddress(req: NextRequest) {
  // passed from the frontend in the Authorization header
  const idToken = req.headers.get("Authorization")?.split(' ')[1];

  // passed from the frontend in the request body. Cloud be either a wallet_address or public_address
  const wallet_address = (await req.json())["user_key"];

  if (isStringObject(idToken)) {
    const jwks = jose.createRemoteJWKSet(new URL("https://authjs.web3auth.io/jwks"));
    try {
      const jwtDecoded = await jose.jwtVerify(idToken, jwks, { algorithms: ["ES256"] });

      if ((jwtDecoded.payload as any).wallets[0].address == wallet_address) {
        return NextResponse.next()
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { message: `${wallet_address}: 'Verification failed'` },
        { status: 503, headers: { 'content-type': 'application/json' } })
    }
  }
}

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {

  await verifyByPublicKey(req)
  await verifyByWalletAddress(req)

  // in case of bypass through verifications, it might mean that no tokenId was received
  const user_key = (await req.json())["user_key"]
  return NextResponse.json(
    { message: `${user_key}: 'Verification failed'` },
    { status: 401, headers: { 'content-type': 'application/json' } })
}

export const config = {
  matcher: ['/api/quest/:path*'],
}