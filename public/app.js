const state = { drones: [], editingId: null };

const tableBody = document.querySelector('#drone-table-body');
const emptyState = document.querySelector('#empty-state');
const searchInput = document.querySelector('#search-input');
const modal = document.querySelector('#modal');
const form = document.querySelector('#drone-form');
const formError = document.querySelector('#form-error');
const modalTitle = document.querySelector('#modal-title');
const saveButton = document.querySelector('#save-button');

function showToast(message, isError = false) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.className = `toast visible${isError ? ' error' : ''}`;
  window.setTimeout(() => { toast.className = 'toast'; }, 2800);
}

function openModal(drone = null) {
  state.editingId = drone?.id || null;
  modalTitle.textContent = drone ? 'Editar drone' : 'Nuevo drone';
  saveButton.textContent = drone ? 'Guardar cambios' : 'Guardar drone';
  formError.textContent = '';
  form.reset();
  if (drone) {
    Object.entries(drone).forEach(([key, value]) => {
      if (form.elements[key]) form.elements[key].value = value;
    });
  }
  modal.hidden = false;
  form.elements.serial.focus();
}

function closeModal() {
  modal.hidden = true;
  state.editingId = null;
}

function render() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = state.drones.filter((drone) => [drone.serial, drone.modelo, drone.fabricante].some((value) => value.toLowerCase().includes(query)));
  tableBody.innerHTML = filtered.map((drone) => `
    <tr>
      <td><div class="drone-name"><span class="drone-symbol">✦</span><span><strong>${escapeHtml(drone.modelo)}</strong><small>${escapeHtml(drone.serial)}</small></span></div></td>
      <td><span class="manufacturer">${escapeHtml(drone.fabricante)}</span></td>
      <td><strong>${Number(drone.peso).toFixed(3)}</strong> <span class="kg">kg</span></td>
      <td><code>${drone.id.slice(0, 8)}...</code></td>
      <td><div class="row-actions"><button class="row-button" data-action="edit" data-id="${drone.id}" title="Editar drone" aria-label="Editar drone">✎</button><button class="row-button danger" data-action="delete" data-id="${drone.id}" title="Eliminar drone" aria-label="Eliminar drone">⌫</button></div></td>
    </tr>`).join('');
  emptyState.hidden = filtered.length > 0;
  document.querySelector('#record-count').textContent = `${filtered.length} ${filtered.length === 1 ? 'registro' : 'registros'}`;
  document.querySelector('#total-count').textContent = state.drones.length;
  document.querySelector('#manufacturer-count').textContent = new Set(state.drones.map((drone) => drone.fabricante)).size;
  const average = state.drones.length ? state.drones.reduce((sum, drone) => sum + Number(drone.peso), 0) / state.drones.length : 0;
  document.querySelector('#average-weight').textContent = `${average.toFixed(2)} kg`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}

async function loadDrones() {
  document.querySelector('#record-count').textContent = 'Actualizando...';
  try {
    const response = await fetch('/api/drones');
    if (!response.ok) throw new Error('No se pudo cargar la flota');
    state.drones = await response.json();
    render();
  } catch (error) {
    showToast(error.message, true);
    document.querySelector('#record-count').textContent = 'Error de conexión';
  }
}

async function saveDrone(event) {
  event.preventDefault();
  formError.textContent = '';
  saveButton.disabled = true;
  const data = Object.fromEntries(new FormData(form));
  data.peso = Number(data.peso);
  const url = state.editingId ? `/api/drones/${state.editingId}` : '/api/drones';
  try {
    const response = await fetch(url, { method: state.editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'No se pudo guardar el drone');
    closeModal();
    await loadDrones();
    showToast(state.editingId ? 'Drone actualizado' : 'Drone registrado');
  } catch (error) {
    formError.textContent = error.message;
  } finally {
    saveButton.disabled = false;
  }
}

async function deleteDrone(id) {
  const drone = state.drones.find((item) => item.id === id);
  if (!drone || !window.confirm(`¿Eliminar el drone ${drone.serial}?`)) return;
  const response = await fetch(`/api/drones/${id}`, { method: 'DELETE' });
  if (!response.ok) { showToast('No se pudo eliminar el drone', true); return; }
  await loadDrones();
  showToast('Drone eliminado');
}

document.querySelector('#new-drone-button').addEventListener('click', () => openModal());
document.querySelector('#close-modal').addEventListener('click', closeModal);
document.querySelector('#cancel-button').addEventListener('click', closeModal);
document.querySelector('#refresh-button').addEventListener('click', loadDrones);
searchInput.addEventListener('input', render);
form.addEventListener('submit', saveDrone);
modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
tableBody.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  const drone = state.drones.find((item) => item.id === button.dataset.id);
  if (button.dataset.action === 'edit') openModal(drone);
  if (button.dataset.action === 'delete') deleteDrone(button.dataset.id);
});

document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !modal.hidden) closeModal(); });
loadDrones();
