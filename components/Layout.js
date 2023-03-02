import styles from "./layout.module.scss";
import img1 from "../public/assets/Fondo1.jpg";
import Image from "next/image";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";
import Link from "next/link";

// NAV BAR
export function Layout({ children }) {
    return (
        <div>
            <div className={styles.slider}>
                <Image className={styles.imagen} src={img1} alt="imagen1" placeholder="blur" width="280" />
                <div>
                    <nav className={styles.menuNavBar}>
                        <ol className={styles.menu}>
                            <la><Link href="/whoWeAre/whoWeAre">QUIENES SOMOS</Link></la>
                            <la className={styles.blockMenu}>HOTEL
                                <MdOutlineKeyboardArrowDown />
                                <ul>
                                    <li className={styles.optionsMenu}><Link href="/welcome/welcome">Bienvenida</Link></li>
                                    <li className={styles.optionsMenu}><Link href="/services/services">Servicios</Link></li>
                                    <li className={styles.optionsMenu}><Link href="/galery/galery">Galeria</Link></li>
                                    <li className={styles.optionsMenu}><Link href="https://www.hotelrosalesneiva.com/docs/HOTEL_ROSALES_PROTOCOLO_COVID_19.pdf" target="_blank" rel="noopener noreferrer">Protocolo de Bioseguridad</Link></li>
                                    <li className={styles.optionsMenu}><Link href="/localization/localization">Localización</Link></li>
                                </ul>
                            </la>
                            <la> HABITACIONES
                                <MdOutlineKeyboardArrowDown />
                                <ul>
                                    <li className={styles.optionsMenu}><Link href="/welcome/welcome">Estándar</Link></li>
                                    <li className={styles.optionsMenu}><Link href="/welcome/welcome">Premium</Link></li>
                                    <li className={styles.optionsMenu}><Link href="/welcome/welcome">Lujo</Link></li>
                                </ul>
                            </la>
                            <la>OFERTAS</la>
                            <la>CONTACTAR</la>
                            <la>RESERVAS</la>
                        </ol>
                    </nav>
                </div>
            </div>

            <div>{children}</div>

            <h1>Bienvenidos al Hotel Rosales</h1>
            <p>En nuestro hotel, cada huésped es único y es precisamente por esto que contamos con un nivel de servicio inmejorable, distinguiéndonos por nuestra innovación y nuestra amabilidad</p>

            <div className={styles.containerRooms}>
                <div className={styles.rooms}><div className={styles.dfdfdfd}><div className={styles.borderRooms}>Estándar Doble</div></div></div>
                <div className={styles.rooms}><div className={styles.dfdfdfd}><div className={styles.borderRooms}>Doble Superior</div></div></div>
                <div className={styles.rooms}><div className={styles.dfdfdfd}><div className={styles.borderRooms}>Twin Superior</div></div></div>
            </div>

            <div>
                <h2>Naiva</h2>
                <div className={styles.rooms}><div className={styles.dfdfdfd}><div className={styles.borderRooms}>Estándar Doble</div></div></div>
                <p>La ciudad de Neiva es la capital del departamento del Huila. Está llena de tradiciones y lugares aledaños hermosos para recorrer, además de contar con la hospitalidad que caracteriza a los Opitas; debido a esto, usted podrá disfrutar de unas vacaciones muy placenteras.</p>
                <p>Neiva está ubicada entre el Río Ceibas y el Río Loro, su historia se encuentra unida al Tolima por haber sido parte del denominado Tolima Grande. Desde la colonia, las dos regiones estaban unidas. No fue sino hasta 1886, después de varias reorganizaciones territoriales que se creó el Departamento del Huila. Desde la fundación de la ciudad el crecimiento fue lento, por espacio de 102 años hasta llegar el siglo XX. Después de los años 30 comenzó a crecer rápidamente, aumentando su desarrollo económico, cultural e industrial.</p>
                <p>Es una zona rica en petróleo, oro, plata, cobre, hierro, hulla y sal; y, tiene una alta actividad comercial y turística, lo que la convierte en la ciudad más importante del suroccidente de Colombia (encolombia.com, 2017).</p>
            </div>

            <div>
                <h2>Planes Especiales</h2>
                <div className={styles.rooms}><div className={styles.dfdfdfd}><div className={styles.borderRooms}>Disfruta de nuestras ofertas especiales para tu estancia.<div className={styles.borderRooms}>Ver ofertas</div></div></div></div>
            </div>

            <div>
                <h2>Newsletter</h2>
                <p>Suscríbite a nuestro newsletter para recibir información sobre nuestras promociones y ofertas especiales.</p>
                <div><input type='text' placeholder="Introduzca su email" /><IoIosArrowForward /></div>
            </div>

            <button>DEJANOS TU OPINION</button>
        </div>
    );
};