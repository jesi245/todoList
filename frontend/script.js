const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

const API_URL = 'http://localhost:3000/tasks'; // Cambia el puerto o URL si usas otro

// Crear elemento li con una tarea recibida del backend
function createTaskElement(task) {
  const li = document.createElement('li');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed || false;

  const span = document.createElement('span');
  span.textContent = task.title;

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Eliminar';

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Editar';
  editBtn.style.marginLeft = '10px';
  editBtn.style.background = '#4CAF50'; // verde
  editBtn.style.boxShadow = '0 6px 12px rgba(76, 175, 80, 0.4)';

  // Evento para editar tarea
  editBtn.addEventListener('click', () => {
    const newTitle = prompt('Editar tarea:', task.title);
    if (newTitle && newTitle.trim() !== '' && newTitle !== task.title) {
      fetch(`${API_URL}/${task._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle.trim(), completed: checkbox.checked }),
      })
      .then(res => {
        if (!res.ok) throw new Error();
        span.textContent = newTitle.trim();
        task.title = newTitle.trim(); // actualizar título local para evitar discrepancias
      })
      .catch(() => alert('Error al editar la tarea'));
    }
  });

  // Evento para actualizar estado completado
  checkbox.addEventListener('change', async () => {
    try {
      await fetch(`${API_URL}/${task._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: span.textContent, completed: checkbox.checked }),
      });
      task.completed = checkbox.checked; // actualizar estado local
    } catch (error) {
      alert('Error actualizando la tarea');
      checkbox.checked = !checkbox.checked;
    }
  });

  // Evento para eliminar tarea
  deleteBtn.addEventListener('click', async () => {
    try {
      const res = await fetch(`${API_URL}/${task._id}`, { method: 'DELETE' });
      if (res.ok) {
        taskList.removeChild(li);
      } else {
        alert('No se pudo eliminar la tarea');
      }
    } catch (error) {
      alert('Error eliminando la tarea');
    }
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);
  li.appendChild(editBtn);

  return li;
}

// Función para cargar tareas desde backend
async function loadTasks() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Error al cargar tareas');
    const tasks = await res.json();
    tasks.forEach(task => {
      const taskElement = createTaskElement(task);
      taskList.appendChild(taskElement);
    });
  } catch (error) {
    alert('No se pudieron cargar las tareas');
  }
}

// Evento para agregar nueva tarea
addTaskBtn.addEventListener('click', async () => {
  const taskText = taskInput.value.trim();
  if (taskText === '') return alert('Por favor, escribe una tarea.');

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: taskText }),
    });
    if (!res.ok) throw new Error('Error al agregar tarea');
    const newTask = await res.json();

    const taskElement = createTaskElement(newTask);
    taskList.appendChild(taskElement);

    taskInput.value = '';
    taskInput.focus();
  } catch (error) {
    alert('No se pudo agregar la tarea');
  }
});

// Al cargar la página cargar las tareas existentes
window.addEventListener('DOMContentLoaded', loadTasks);
