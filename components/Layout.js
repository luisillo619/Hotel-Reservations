import styles from "./layout.module.scss";
import img1 from "../public/assets/Fondo1.jpg";
import Image from 'next/image';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import Link from "next/link";
// NAV BAR
export function Layout({ children }) {
  return (
    <>
     
      <div >
        <nav className={styles.menuNavBar}>
            <ol className={styles.menu}>
              <la>QUIENES SOMOS</la>
              <la>HOTEL<MdOutlineKeyboardArrowDown />
                <ul>
                  <li><Link href="/#">Bienvenida</Link></li>
                  <li><Link href="/#">Servicios</Link></li>
                  <li><Link href="/#">Galeria</Link></li>
                  <li><Link href="/#">Protocolo de Bioseguridad</Link></li>
                  <li><Link href="/#">Localización</Link></li>
                </ul>
              </la>
              <la>HABITACIONES<MdOutlineKeyboardArrowDown />
                <ul>
                  <li><Link href="/#">Estándar</Link></li>
                  <li><Link href="/#">Premium</Link></li>
                  <li><Link href="/#">Lujo</Link></li>
                </ul>
              </la>
              <la><Image src={img1} alt="imagen1" placeholder='blur' width="280"/></la>
              <la>OFERTAS</la>
              <la>CONTACTAR</la>
              <la>RESERVAS</la>
            </ol>
          </nav>
      </div>
      <div >{children}</div>
    </>
  );
}
