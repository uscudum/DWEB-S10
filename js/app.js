import { db } from "./firebase/config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const tablaEstudiantes = document.querySelector("#tablaEstudiantes");
const ranking = document.querySelector("#ranking");
const carrerasContenedor = document.querySelector("#carreras");
const asignaturasContenedor = document.querySelector("#asignaturas");
const destacadosContenedor = document.querySelector("#destacados");
const mensaje = document.querySelector("#mensaje");

function formatearPromedio(valor) {
  return valor.toFixed(1).replace(".", ",");
}

// Esta función ya está implementada para que puedas usar los nombres de las carreras.
async function obtenerCarreras() {
  const respuesta = await getDocs(collection(db, "carreras"));
  return respuesta.docs.map((documento) => ({ id: documento.id, ...documento.data() }));
}

// Ejemplo resuelto: estas carreras se cargan al abrir la página.
function mostrarCarreras(carreras) {
  carrerasContenedor.innerHTML = carreras
    .sort((a, b) => a.nombre.localeCompare(b.nombre))
    .map((carrera) => `
      <div class="subject-item">
        <strong class="d-block small">${carrera.nombre}</strong>
        <span class="small text-secondary">${carrera.modalidad} &middot; ${carrera.duracion}</span>
      </div>
    `).join("");
}

// Ejemplo resuelto: esta consulta trae los estudiantes que se muestran en la tabla.
async function obtenerEstudiantes() {
  const respuesta = await getDocs(collection(db, "estudiantes"));
  return respuesta.docs.map((documento) => ({ id: documento.id, ...documento.data() }));
}

// TODO 1: Consultá la colección "asignaturas" y devolvé un array de objetos.
// Pista: reutilizá collection(), getDocs(), document.id y document.data().
async function obtenerAsignaturas() {

}

// Esta función ya está implementada. Recibe los datos y genera las filas de la tabla.
function mostrarEstudiantes(estudiantes, carreras) {
  const carrerasPorId = Object.fromEntries(carreras.map((carrera) => [carrera.id, carrera.nombre]));
  const ordenados = [...estudiantes].sort((a, b) => b.promedio - a.promedio);

  tablaEstudiantes.innerHTML = ordenados.map((estudiante) => `
    <tr>
      <td><strong class="d-block">${estudiante.nombre} ${estudiante.apellido}</strong><span class="small text-secondary">${estudiante.email}</span></td>
      <td class="small">${carrerasPorId[estudiante.carreraId] || "Sin carrera"}</td>
      <td class="text-center fw-bold">${formatearPromedio(estudiante.promedio)}</td>
      <td class="text-center">${estudiante.asistencia}%</td>
      <td><span class="badge ${estudiante.estado === "activo" ? "status-active" : "status-follow"}">${estudiante.estado}</span></td>
    </tr>
  `).join("");

  document.querySelector("#contadorTabla").textContent = `${estudiantes.length} estudiantes`;
}

// TODO 2: Generá el Top 3 de estudiantes según su promedio.
// 1. Ordená una copia del array de mayor a menor por promedio.
// 2. Usá slice(0, 3) para conservar solo tres estudiantes.
// 3. Generá dentro de #ranking el HTML de cada posición.
function mostrarRanking(estudiantes, carreras) {

}

// TODO 3: Mostrá únicamente los estudiantes cuyo campo destacado sea true.
// 1. Utilizá filter() sobre el array de estudiantes.
// 2. Generá una tarjeta breve con nombre, carrera y promedio para cada resultado.
// 3. Insertá el resultado en #destacados.
function mostrarDestacados(estudiantes, carreras) {

}

// Esta función ya está implementada. Solo necesita recibir el array de asignaturas.
function mostrarAsignaturas(asignaturas) {
  asignaturasContenedor.innerHTML = asignaturas
    .sort((a, b) => a.nombre.localeCompare(b.nombre))
    .map((asignatura) => `
      <div class="subject-item">
        <strong class="d-block small">${asignatura.nombre}</strong>
        <span class="small text-secondary">Semestre ${asignatura.semestre} &middot; ${asignatura.creditos} cr&eacute;ditos</span>
      </div>
    `).join("");
}

function mostrarIndicadores(estudiantes, carreras, asignaturas) {
  const promedio = estudiantes.reduce((acumulado, estudiante) => acumulado + estudiante.promedio, 0) / estudiantes.length;
  document.querySelector("#totalEstudiantes").textContent = estudiantes.length;
  document.querySelector("#totalCarreras").textContent = carreras.length;
  document.querySelector("#totalAsignaturas").textContent = asignaturas.length;
  document.querySelector("#promedioGeneral").textContent = formatearPromedio(promedio);
}

async function cargarPanel() {
  const boton = document.querySelector("#btnActualizar");
  boton.disabled = true;
    boton.textContent = "Cargando...";
  mensaje.className = "alert d-none";

  try {
    // Este bloque ya está preparado: llama a las tres funciones de consulta.
    const [estudiantes, carreras, asignaturas] = await Promise.all([
      obtenerEstudiantes(),
      obtenerCarreras(),
      obtenerAsignaturas()
    ]);

    mostrarIndicadores(estudiantes, carreras, asignaturas);
    mostrarEstudiantes(estudiantes, carreras);
    mostrarRanking(estudiantes, carreras);
    mostrarAsignaturas(asignaturas);
    mostrarDestacados(estudiantes, carreras);
    document.querySelector("#ultimaActualizacion").textContent = `Actualizado: ${new Date().toLocaleTimeString("es-UY", { hour: "2-digit", minute: "2-digit" })}`;
  } catch (error) {
    console.error(error);
    mensaje.textContent = "No fue posible cargar los datos. Revisá la conexión y las reglas de Firestore.";
    mensaje.className = "alert alert-danger";
    tablaEstudiantes.innerHTML = '<tr><td colspan="5" class="loading-box">No se pudieron cargar los estudiantes.</td></tr>';
    ranking.innerHTML = '<div class="loading-box">No se pudo calcular el ranking.</div>';
    asignaturasContenedor.innerHTML = '<div class="loading-box">No se pudieron cargar las asignaturas.</div>';
  } finally {
    boton.disabled = false;
    boton.textContent = "Cargar panel completo";
  }
}

document.querySelector("#btnActualizar").addEventListener("click", cargarPanel);

// Este bloque se ejecuta al abrir la página para mostrar un ejemplo completo.
// Consultá cómo se obtienen los estudiantes y cómo se envían a mostrarEstudiantes().
async function cargarEjemploInicial() {
  try {
    const [carreras, estudiantes] = await Promise.all([
      obtenerCarreras(),
      obtenerEstudiantes()
    ]);

    mostrarCarreras(carreras);
    mostrarEstudiantes(estudiantes, carreras);

    document.querySelector("#totalCarreras").textContent = carreras.length;
    document.querySelector("#totalEstudiantes").textContent = estudiantes.length;
    const promedio = estudiantes.reduce((acumulado, estudiante) => acumulado + estudiante.promedio, 0) / estudiantes.length;
    document.querySelector("#promedioGeneral").textContent = formatearPromedio(promedio);
  } catch (error) {
    console.error(error);
    carrerasContenedor.innerHTML = '<div class="loading-box">No fue posible cargar las carreras.</div>';
    tablaEstudiantes.innerHTML = '<tr><td colspan="5" class="loading-box">No fue posible cargar los estudiantes.</td></tr>';
  }
}

cargarEjemploInicial();
