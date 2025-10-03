// Loader
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  const content = document.getElementById("content");
  loader.style.display = "none";
  content.classList.remove("hidden");
});

// Bienvenida personalizada
const mensajeBienvenida = document.getElementById("mensajeBienvenida");
const btnUsuario = document.getElementById("btnUsuario");

function mostrarBienvenida() {
  const nombre = localStorage.getItem("usuarioNombre");
  if (nombre) {
    mensajeBienvenida.textContent = `¡Bienvenido de nuevo, ${nombre}! 🍰`;
  } else {
    mensajeBienvenida.textContent = "¡Bienvenido a Enrolados!";
  }
}
btnUsuario.addEventListener("click", () => {
  const nombre = prompt("Ingresa tu nombre:");
  if (nombre) {
    localStorage.setItem("usuarioNombre", nombre);
    mostrarBienvenida();
  }
});
mostrarBienvenida();

// Carrito
let carrito = {};
function agregarAlCarrito(producto) {
  if (carrito[producto]) {
    carrito[producto]++;
  } else {
    carrito[producto] = 1;
  }
  actualizarCarrito();
}
function actualizarCarrito() {
  const lista = document.getElementById("listaCarrito");
  lista.innerHTML = "";
  for (let producto in carrito) {
    const li = document.createElement("li");
    li.textContent = `${producto} x${carrito[producto]}`;
    lista.appendChild(li);
  }
}
document.getElementById("btnPedido").addEventListener("click", () => {
  if (Object.keys(carrito).length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }
  let pedido = "Quiero pedir: ";
  for (let producto in carrito) {
    pedido += `${producto} x${carrito[producto]}, `;
  }
  const url = `https://wa.me/529711315148?text=${encodeURIComponent(pedido)}`;
  window.open(url, "_blank");
});
document.getElementById("btnVaciar").addEventListener("click", () => {
  carrito = {};
  actualizarCarrito();
});

// Compartir ubicación
document.getElementById("btnUbicacion").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const url = `https://wa.me/529711315148?text=Mi ubicación es: https://www.google.com/maps?q=${lat},${lon}`;
      window.open(url, "_blank");
    }, () => {
      alert("No pudimos obtener tu ubicación.");
    });
  } else {
    alert("Tu navegador no soporta geolocalización.");
  }
});
