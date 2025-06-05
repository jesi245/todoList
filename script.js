const agregarBtn = document.getElementById("agregarBtn");
const nuevaTareaInput = document.getElementById("nuevaTarea");
const listaTareas = document.getElementById("listaTareas");

let tareas = [];

// Acá voy a cargar tareas guardadas al iniciar
window.addEventListener("DOMContentLoaded", () => {
  const tareasGuardadas = localStorage.getItem("tareas");
  if (tareasGuardadas) {
    tareas = JSON.parse(tareasGuardadas);
    tareas.forEach((tarea) => renderTarea(tarea));
  }
});

agregarBtn.addEventListener("click", () => {
  const texto = nuevaTareaInput.value.trim();
  if (texto === "") return;

  const nuevaTarea = {
    texto: texto,
    completada: false,
  };

  tareas.push(nuevaTarea);
  guardarTareas();
  renderTarea(nuevaTarea);

  nuevaTareaInput.value = "";
});

function renderTarea(tarea) {
  const li = document.createElement("li");
  if (tarea.completada) li.classList.add("completada");

  const span = document.createElement("span");
  span.textContent = tarea.texto;

  const botones = document.createElement("div");
  botones.classList.add("botones");

  const btnCompletar = document.createElement("button");
  btnCompletar.textContent = "✔";
  btnCompletar.classList.add("btn-completar");
  btnCompletar.onclick = () => {
    tarea.completada = !tarea.completada;
    li.classList.toggle("completada");
    guardarTareas();
  };

  const btnEliminar = document.createElement("button");
  btnEliminar.textContent = "✖";
  btnEliminar.classList.add("btn-eliminar");
  btnEliminar.onclick = () => {
    tareas = tareas.filter((t) => t !== tarea);
    li.remove();
    guardarTareas();
  };

  botones.appendChild(btnCompletar);
  botones.appendChild(btnEliminar);

  li.appendChild(span);
  li.appendChild(botones);

  listaTareas.appendChild(li);
}

function guardarTareas() {
  localStorage.setItem("tareas", JSON.stringify(tareas));
}
