const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

addTaskBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  if (taskText === '') return alert('Por favor, escribe una tarea.');

  // Crear elementos de tarea
  const li = document.createElement('li');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';

  const span = document.createElement('span');
  span.textContent = taskText;

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Eliminar';

  // Evento para eliminar tarea
  deleteBtn.addEventListener('click', () => {
    taskList.removeChild(li);
  });

  // Agregar elementos a li
  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);

  // Agregar li a la lista
  taskList.appendChild(li);

  // Limpiar input
  taskInput.value = '';
  taskInput.focus();
});
