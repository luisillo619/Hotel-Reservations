import { useSession } from "next-auth/client";

export default function AdminRoute({ children }) {
  const [session] = useSession();

  if (session?.jwt && session.jwt.role === "admin") {
    return <>{children}</>;
  }

  return <p>No tienes acceso a esta página.</p>;
}