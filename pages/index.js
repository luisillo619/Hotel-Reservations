import { Layout } from "@/components/Layout";
import axios from "axios";


//Se encarga de traer la infom de la API
export async function getServerSideProps (context) { //traer informacion de backend
  try {
    const { data } = await axios.get("http://localhost:3000/api/rooms");
   // const { data } = await axios.get(`${process.env.API_ULR}api/rooms`);
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


//Esto se encarga de renderizar en pantalla
export default function Home ({ rooms }) {
 
  if (rooms) {
    return (
      <>
         {/* {rooms.map((e) => {
          return (
            <div key={e._id}>
              <p>{e.nombre}</p>
            </div>
          );
        })} */}
        <Layout />
      </>
    );
  };
};