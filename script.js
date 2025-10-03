// Loader
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").style.display = "none";
    document.getElementById("content").classList.remove("hidden");
  }, 1000);
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

// Productos
const rolesSabores = [
  "Nutella","Fresa","Cajeta","Oreo","Mango",
  "Pistache","Café","Kinder","Plátano","Almendra"
];
const rolesContainer = document.getElementById("roles");
rolesSabores.forEach(sabor => {
  const div = document.createElement("div");
  div.className = "item";
  div.innerHTML = `<img src="rol.jpg"><h4>Rol ${sabor}</h4>
                   <button onclick="agregarAlCarrito('Rol ${sabor}')">Agregar</button>`;
  rolesContainer.appendChild(div);
});

// Carrito
let carrito = {};
let ubicacionCliente = null;
function agregarAlCarrito(producto) {
  carrito[producto] = (carrito[producto] || 0) + 1;
  actualizarCarrito();
}
function quitarDelCarrito(producto) {
  if (carrito[producto]) {
    carrito[producto]--;
    if (carrito[producto] <= 0) delete carrito[producto];
  }
  actualizarCarrito();
}
function actualizarCarrito() {
  const lista = document.getElementById("listaCarrito");
  lista.innerHTML = "";
  for (let producto in carrito) {
    const li = document.createElement("li");
    li.innerHTML = `${producto} x${carrito[producto]} 
      <button onclick="quitarDelCarrito('${producto}')">❌</button>`;
    lista.appendChild(li);
  }
}
document.getElementById("btnVaciar").addEventListener("click", () => {
  carrito = {};
  actualizarCarrito();
});

// Pedido con ubicación
document.getElementById("btnPedido").addEventListener("click", () => {
  if (Object.keys(carrito).length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }
  let pedido = "Orden previa:\n";
  for (let producto in carrito) {
    pedido += `- ${producto} x${carrito[producto]}\n`;
  }
  if (ubicacionCliente) {
    pedido += `\nUbicación: https://www.google.com/maps?q=${ubicacionCliente.lat},${ubicacionCliente.lon}`;
  }
  if (confirm(pedido + "\n\n¿Enviar por WhatsApp?")) {
    const url = `https://wa.me/529711315148?text=${encodeURIComponent(pedido)}`;
    window.open(url, "_blank");
  }
});

// Guardar ubicación
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((pos) => {
    ubicacionCliente = { lat: pos.coords.latitude, lon: pos.coords.longitude };
  });
}

// Reseñas
const listaReseñas = document.getElementById("listaReseñas");
function mostrarReseñas() {
  listaReseñas.innerHTML = "";
  const reseñas = JSON.parse(localStorage.getItem("reseñas") || "[]");
  reseñas.forEach(r => {
    const div = document.createElement("div");
    div.className = "reseña";
    div.innerHTML = `<strong>${r.nombre}</strong> - ${"⭐".repeat(r.estrellas)}<p>${r.texto}</p>`;
    listaReseñas.appendChild(div);
  });
}
document.getElementById("btnReseña").addEventListener("click", () => {
  const nombre = prompt("Tu nombre:");
  const estrellas = prompt("Calificación (1-5):");
  const texto = prompt("Escribe tu reseña:");
  if (nombre && estrellas && texto) {
    const reseñas = JSON.parse(localStorage.getItem("reseñas") || "[]");
    reseñas.push({ nombre, estrellas, texto });
    localStorage.setItem("reseñas", JSON.stringify(reseñas));
    mostrarReseñas();
  }
});
mostrarReseñas();

// PWA Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
