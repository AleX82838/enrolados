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

// ================== CARRITO ==================
let carrito = {};
let ubicacionCliente = null;

function agregarAlCarrito(producto) {
  if (carrito[producto]) {
    carrito[producto]++;
  } else {
    carrito[producto] = 1;
  }
  actualizarCarrito();
}

function quitarDelCarrito(producto) {
  if (carrito[producto]) {
    carrito[producto]--;
    if (carrito[producto] <= 0) {
      delete carrito[producto];
    }
    actualizarCarrito();
  }
}

function actualizarCarrito() {
  const lista = document.getElementById("listaCarrito");
  lista.innerHTML = "";
  for (let producto in carrito) {
    const li = document.createElement("li");
    li.innerHTML = `${producto} x${carrito[producto]} 
      <button onclick="quitarDelCarrito('${producto}')" class="btn-danger" style="padding:3px 8px; font-size:12px;">❌</button>`;
    lista.appendChild(li);
  }
}

document.getElementById("btnPedido").addEventListener("click", () => {
  if (Object.keys(carrito).length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  let pedido = "🛒 Pedido Enrolados:%0A";
  for (let producto in carrito) {
    pedido += `- ${producto} x${carrito[producto]}%0A`;
  }

  if (ubicacionCliente) {
    pedido += `%0A📍 Ubicación: ${ubicacionCliente}`;
  } else {
    pedido += "%0A📍 El cliente no compartió ubicación.";
  }

  const url = `https://wa.me/529711315148?text=${pedido}`;
  // 🔥 Se abre directo sin confirmar
  window.location.href = url;
});

document.getElementById("btnVaciar").addEventListener("click", () => {
  carrito = {};
  actualizarCarrito();
});

// ================== UBICACIÓN ==================
document.getElementById("btnUbicacion").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        ubicacionCliente = `https://www.google.com/maps?q=${lat},${lon}`;
        alert("✅ Ubicación guardada para el pedido.");
      },
      () => {
        alert("❌ No pudimos obtener tu ubicación.");
      }
    );
  } else {
    alert("Tu navegador no soporta geolocalización.");
  }
});



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


// ================== PWA ==================
let deferredPrompt;
const btnInstalar = document.getElementById("btnInstalar");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  btnInstalar.classList.remove("hidden");
});

btnInstalar.addEventListener("click", async () => {
  if (!deferredPrompt) {
    alert("La instalación no está disponible en este momento.");
    return;
  }
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === "accepted") {
    console.log("✅ App instalada correctamente");
  } else {
    console.log("❌ Instalación cancelada");
  }
  deferredPrompt = null;
});
