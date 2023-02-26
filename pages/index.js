import { Layout } from "@/components/Layout";
import axios from "axios";

export default function Home({ rooms }) {
  if (rooms) {
    return (
      <>
        {rooms.map((e) => {
          return (
            <div key={e._id}>
              <p>{e.nombre}</p>
            </div>
          );
        })}
      </>
    );
  }
}

export async function getServerSideProps(context) {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/rooms`
    );
    return {
      props: {
        rooms: data,
      },
    };
  } catch (error) {
    return {
      props: {
        products: null,
      },
    };
  }
}
