// middleware.ts
// NEXTAUTH_SECRET SE RECOJE AUTOMATICAMENTE POR EL MIDDELWARE
import { withAuth } from "next-auth/middleware";

// la diferencia del middleware nativo y with auth es que withAuth hace la verificacion de sesion automaticamente, y si no la tiene hace la redireccion a page de [...nextauth].js y podemos agregar una verificacion entra como admin, pero en el middleware nativo se tiene que verificar si existe la sesion y aparte verificar si es admin. En conlucion, withAuth te ahorra un paso
export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    console.log(req.nextauth.token);
  },
  {
    callbacks: {
      // MIDDLEWARE SE ACTIVARA SI TOKEN?.ROLE === "ADMIN" = TRUE
      authorized({ token }) {
        console.log("token", token);
        return token?.role === "admin";
      },
    },
  }
);

export const config = { matcher: ["/admin"] };
