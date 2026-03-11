const REPO   = 'KR-Fischi/stoffwechselkur';
const BRANCH = 'main';

// Zutaten die immer im Haushalt vorhanden sind → nicht im Filter anzeigen
const PANTRY = new Set(['Salz', 'Pfeffer', 'Salz & Pfeffer', 'Wasser']);

let allRecipes = [];

// ── Laden & Parsen ────────────────────────────────────────────────────────────

async function loadRecipes() {
  try {
    const treeRes = await fetch(
      `https://api.github.com/repos/${REPO}/git/trees/${BRANCH}?recursive=1`
    );
    if (!treeRes.ok) throw new Error(`GitHub API: ${treeRes.status} ${treeRes.statusText}`);

    const tree = await treeRes.json();
    const files = tree.tree.filter(f =>
      f.path.startsWith('Rezepte/') &&
      f.path.endsWith('.md') &&
      f.type === 'blob'
    );

    if (files.length === 0) {
      showError('Noch keine Rezepte im Repository gefunden.');
      return;
    }

    const results = await Promise.all(files.map(fetchRecipe));
    allRecipes = results.filter(Boolean);

    buildIngredientsFilter();
    renderRecipes();

    document.getElementById('loading').classList.add('hidden');
    document.getElementById('recipe-grid').classList.remove('hidden');

  } catch (err) {
    document.getElementById('loading').classList.add('hidden');
    showError(`Fehler beim Laden: ${err.message}`);
  }
}

async function fetchRecipe(file) {
  try {
    const encodedPath = file.path.split('/').map(encodeURIComponent).join('/');
    const url = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${encodedPath}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const text = await res.text();
    return parseRecipe(text, file.path);
  } catch {
    return null;
  }
}

function parseRecipe(content, path) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  try {
    const data = jsyaml.load(match[1]);
    if (!data || !data.name) return null;
    data._body = content.slice(match[0].length).trim();
    data._path = path;
    return data;
  } catch {
    return null;
  }
}

// ── Zutaten-Filter aufbauen ───────────────────────────────────────────────────

function buildIngredientsFilter() {
  const allIngredients = new Set();
  allRecipes.forEach(r => {
    (r.zutaten || []).forEach(z => {
      if (z.name && !PANTRY.has(z.name) && z.menge !== 'nach Geschmack') {
        allIngredients.add(z.name);
      }
    });
  });

  const container = document.getElementById('ingredients-filter');
  container.innerHTML = '';

  [...allIngredients].sort().forEach(name => {
    const label = document.createElement('label');
    label.className = 'filter-label';
    label.innerHTML = `<input type="checkbox" class="ingredient-check" value="${name}"> ${name}`;
    container.appendChild(label);
    label.querySelector('input').addEventListener('change', renderRecipes);
  });
}

// ── Filter lesen ─────────────────────────────────────────────────────────────

function getFilters() {
  return {
    phases:    [...document.querySelectorAll('input[name="phase"]:checked')].map(i => i.value),
    kategorien:[...document.querySelectorAll('input[name="kategorie"]:checked')].map(i => i.value),
    zutaten:   [...document.querySelectorAll('.ingredient-check:checked')].map(i => i.value),
    search:    document.getElementById('search').value.toLowerCase().trim(),
  };
}

function matchesFilters(recipe, { phases, kategorien, zutaten, search }) {
  // Phase
  const rPhases = recipe.phase || [];
  if (!phases.some(p => rPhases.includes(p))) return false;

  // Kategorie
  if (!kategorien.includes(recipe.kategorie)) return false;

  // Zutaten: zeige nur Rezepte, bei denen alle benötigten Zutaten ausgewählt sind
  if (zutaten.length > 0) {
    const needed = (recipe.zutaten || [])
      .filter(z => z.name && !PANTRY.has(z.name) && z.menge !== 'nach Geschmack')
      .map(z => z.name);
    if (!needed.every(n => zutaten.includes(n))) return false;
  }

  // Suche
  if (search && !recipe.name.toLowerCase().includes(search)) return false;

  return true;
}

// ── Rendern ──────────────────────────────────────────────────────────────────

function renderRecipes() {
  const filters  = getFilters();
  const filtered = allRecipes.filter(r => matchesFilters(r, filters));
  const grid     = document.getElementById('recipe-grid');
  const countEl  = document.getElementById('recipe-count');

  countEl.textContent = `${filtered.length} Rezept${filtered.length !== 1 ? 'e' : ''}`;

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="no-results">Keine Rezepte gefunden 🤔<br><small>Passe die Filter an</small></div>';
    return;
  }

  grid.innerHTML = filtered.map(r => cardHTML(r)).join('');
  grid.querySelectorAll('.recipe-card').forEach((card, i) => {
    card.addEventListener('click',  () => openModal(filtered[i]));
    card.addEventListener('keydown', e => { if (e.key === 'Enter') openModal(filtered[i]); });
  });
}

function cardHTML(recipe) {
  const icon  = { vegetarisch: '🥦', vegan: '🌱', fleisch: '🥩' }[recipe.kategorie] ?? '🍽️';
  const image = recipe.bild
    ? `<div class="card-image"><img src="https://raw.githubusercontent.com/${REPO}/${BRANCH}/Attachments/${encodeURIComponent(recipe.bild)}" alt="${recipe.name}" loading="lazy"></div>`
    : `<div class="card-image">${icon}</div>`;
  const badges = (recipe.phase || []).map(p =>
    `<span class="badge ${p}">${p === 'diät' ? 'Diätphase' : 'Stabi-Phase'}</span>`
  ).join('');

  return `
    <div class="recipe-card" tabindex="0" role="button" aria-label="${recipe.name}">
      ${image}
      <div class="card-body">
        <h3>${recipe.name}</h3>
        <div class="card-meta">
          <span>${icon} ${recipe.kategorie}</span>
          <span>⏱ ${recipe.zubereitungszeit ?? '?'} Min.</span>
          <span>🍽 ${recipe.portionen ?? '?'} Port.</span>
        </div>
        <div class="card-badges">${badges}</div>
      </div>
    </div>`;
}

// ── Modal ────────────────────────────────────────────────────────────────────

function openModal(recipe) {
  const icon   = { vegetarisch: '🥦', vegan: '🌱', fleisch: '🥩' }[recipe.kategorie] ?? '🍽️';
  const badges = (recipe.phase || []).map(p =>
    `<span class="badge ${p}">${p === 'diät' ? 'Diätphase' : 'Stabi-Phase'}</span>`
  ).join(' ');

  const rows = (recipe.zutaten || []).map(z =>
    `<tr><td>${z.menge ?? ''}</td><td>${z.name ?? ''}</td></tr>`
  ).join('');

  document.getElementById('modal-body').innerHTML = `
    <h2>${recipe.name}</h2>
    <div class="modal-meta">
      <span>${icon} ${recipe.kategorie}</span>
      <span>⏱ ${recipe.zubereitungszeit ?? '?'} Minuten</span>
      <span>🍽 ${recipe.portionen ?? '?'} Portionen</span>
      <span>${badges}</span>
    </div>
    <h3>Zutaten</h3>
    <table class="zutaten-table">
      <thead><tr><th>Menge</th><th>Zutat</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <h3>Zubereitung</h3>
    <div class="zubereitung">${marked.parse(recipe._body)}</div>
  `;

  document.getElementById('modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  document.body.style.overflow = '';
}

// ── Event Listeners ──────────────────────────────────────────────────────────

document.getElementById('close-modal').addEventListener('click', closeModal);
document.getElementById('modal-backdrop').addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

document.querySelectorAll('input[name="phase"], input[name="kategorie"]').forEach(input => {
  input.addEventListener('change', renderRecipes);
});
document.getElementById('search').addEventListener('input', renderRecipes);

function showError(msg) {
  const el = document.getElementById('error-msg');
  el.textContent = msg;
  el.classList.remove('hidden');
}

// ── Start ────────────────────────────────────────────────────────────────────
loadRecipes();
