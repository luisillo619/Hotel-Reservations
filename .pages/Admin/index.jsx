import { useSession } from "next-auth/react"; // auth desde el cliente
import { getSession } from "next-auth/react"; // auth desde el servidor

export default function AdminAccess({ children }) {
  const { data: session } = useSession();
  if (session?.role === "admin") {
    return <>{children}</>;
  }

  else return <p>No tienes acceso a esta página.</p>;
}

// auth desde el servidor, poner esto en cada pagina del admin excepto en esta.
// export async function getServerSideProps(context) {
//   const session = await getSession(context);

//   if (!session || session.role !== "admin") {
//     return {
//       redirect: {
//         destination: "/login",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {},
//   };
// }
