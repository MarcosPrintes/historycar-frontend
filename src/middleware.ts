import { NextResponse } from "next/server";

// Este middleware será executado em todas as requisições
export function middleware() {
  // Por enquanto, vamos deixar todas as rotas acessíveis sem verificação
  return NextResponse.next();
}

// Definir em quais rotas o middleware será aplicado
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
