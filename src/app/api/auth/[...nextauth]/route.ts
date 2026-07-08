/**
 * ============================================================================
 * NextAuth route — Bridge opcional entre Next.js y el backend Java
 * ============================================================================
 * Si decides usar NextAuth en vez de manejar el JWT manualmente en Zustand
 * (authStore.ts), este es el lugar para configurarlo. El "Credentials
 * Provider" haría una llamada interna a authService.login() (que a su vez
 * pega contra Spring Boot) y guardaría el JWT resultante en una sesión
 * con cookie httpOnly, más segura que localStorage.
 *
 * Ejemplo (descomentar y completar cuando integres NextAuth):
 *
 * import NextAuth from "next-auth";
 * import CredentialsProvider from "next-auth/providers/credentials";
 * import { login } from "@/services/authService";
 *
 * const handler = NextAuth({
 *   providers: [
 *     CredentialsProvider({
 *       name: "credentials",
 *       credentials: { email: {}, password: {} },
 *       async authorize(credentials) {
 *         const { user, token } = await login(credentials!.email, credentials!.password);
 *         return { ...user, token };
 *       },
 *     }),
 *   ],
 *   session: { strategy: "jwt" },
 *   callbacks: {
 *     async jwt({ token, user }) {
 *       if (user) token.accessToken = (user as any).token;
 *       return token;
 *     },
 *     async session({ session, token }) {
 *       (session as any).accessToken = token.accessToken;
 *       return session;
 *     },
 *   },
 * });
 *
 * export { handler as GET, handler as POST };
 * ============================================================================
 */

export {};
