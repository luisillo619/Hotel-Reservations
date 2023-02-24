const rooms = [
  {
    nombre: "Habitación individual estándar",
    precio: 80,
    descripcion:
      "Una habitación acogedora para una persona, equipada con lo básico para una estadía agradable",
    imagen: "https://ejemplo.com/habitacion_individual_estandar.jpg",
    stock: 10,
    categoria: "estandar",
  },
  {
    nombre: "Habitación doble estándar",
    precio: 80,
    descripcion:
      "Una habitación cómoda con dos camas, equipada con lo básico para una estadía agradable",
    imagen: "https://ejemplo.com/habitacion_doble_estandar.jpg",
    stock: 8,
    categoria: "estandar",
  },
  {
    nombre: "Suite familiar",
    precio: 80,
    descripcion:
      "Una suite espaciosa y elegante para una familia de hasta cuatro personas, equipada con comodidades de lujo para una estadía inolvidable",
    imagen: "https://ejemplo.com/suite_familiar.jpg",
    stock: 3,
    categoria: "lujo",
  },
  {
    nombre: "Habitación superior",
    precio: 120,
    descripcion:
      "Una habitación espaciosa y luminosa con vistas panorámicas, equipada con todo lo necesario para una estadía cómoda y relajante",
    imagen: "https://ejemplo.com/habitacion_superior.jpg",
    stock: 5,
    categoria: "lujo",
  },
  {
    nombre: "Habitación ejecutiva",
    precio: 150,
    descripcion:
      "Una habitación de lujo para viajeros de negocios, equipada con escritorio, sillón ejecutivo y todas las comodidades necesarias para una estadía productiva",
    imagen: "https://ejemplo.com/habitacion_ejecutiva.jpg",
    stock: 2,
    categoria: "lujo",
  },
  {
    nombre: "Habitación con vista al mar",
    precio: 200,
    descripcion:
      "Una habitación exclusiva con vista al mar, equipada con todas las comodidades necesarias para una estadía de ensueño",
    imagen: "https://ejemplo.com/habitacion_vista_mar.jpg",
    stock: 1,
    categoria: "lujo",
  },
];

export default rooms;
// Ejemplo de código usando la API de Exchange Rates

//RbHWAi60ro7sedXw9UaexuQXJ3gZAIXM
// const API_KEY = "TU_API_KEY_AQUI"; // Reemplazar con tu propia clave de API

// async function cotizarHabitacionEnMoneda(habitacion, moneda) {
//   const precio = habitacion.precio.valor;
//   const baseCurrency = habitacion.precio.moneda;

//   const response = await fetch(`https://api.exchangeratesapi.io/latest?base=${baseCurrency}&symbols=${moneda}&access_key=${API_KEY}`);

//   if (!response.ok) {
//     throw new Error("No se pudo obtener las tasas de cambio");
//   }

//   const data = await response.json();

//   const tasaDeCambio = data.rates[moneda];
//   const precioEnMoneda = precio * tasaDeCambio;

//   return precioEnMoneda.toFixed(2);
// }

// // Ejemplo de uso
// const habitacionDeluxe = rooms[1];
// const precioEnEUR = await cotizarHabitacionEnMoneda(habitacionDeluxe, "EUR");
// console.log(precioEnEUR); // Imprime el precio en EUR de la habitación deluxe

// */
