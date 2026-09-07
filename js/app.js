document.addEventListener('DOMContentLoaded', () => {
  const CURRENT_YEAR = new Date().getFullYear();

  let state = {
    currentView: 'dashboard',
    selectedWineId: null,
    editingWineId: null,
    filters: {
      search: '',
      color: '',
      region: '',
      status: '',
      sort: 'nom-asc',
      onlyFav: false
    }
  };

  function getWineStatus(garde) {
    if (!garde || (!garde.debut && !garde.optimal_debut && !garde.fin)) {
      return { label: "Indéterminé", key: "indetermine" };
    }

    const { debut, optimal_debut, optimal_fin, fin } = garde;

    if (debut && CURRENT_YEAR < debut) {
      return { label: "Trop jeune", key: "trop-jeune" };
    }
    if (debut && optimal_debut && CURRENT_YEAR >= debut && CURRENT_YEAR < optimal_debut) {
      return { label: "En garde", key: "en-garde" };
    }
    if (optimal_debut && optimal_fin && CURRENT_YEAR >= optimal_debut && CURRENT_YEAR <= optimal_fin) {
      return { label: "Optimal", key: "optimal" };
    }
    if (optimal_fin && fin && CURRENT_YEAR > optimal_fin && CURRENT_YEAR <= fin) {
      return { label: "À boire", key: "a-boire" };
    }
    if (fin && CURRENT_YEAR > fin) {
      return { label: "À surveiller", key: "a-surveiller" };
    }
    return { label: "En garde", key: "en-garde" };
  }

  function getStatusClass(statusKey) {
    switch (statusKey) {
      case 'trop-jeune': return 'tag-status-trop-jeune';
      case 'en-garde': return 'tag-status-en-garde';
      case 'optimal': return 'tag-status-optimal';
      case 'a-boire': return 'tag-status-a-boire';
      case 'a-surveiller': return 'tag-status-a-surveiller';
      default: return 'tag-color';
    }
  }

  function navigateTo(viewName, params = {}) {
    state.currentView = viewName;
    if (params.wineId) state.selectedWineId = params.wineId;

    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-view') === viewName);
    });

    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    const targetSection = document.getElementById(`view-${viewName}`);
    if (targetSection) targetSection.classList.add('active');

    window.scrollTo(0, 0);
    renderActiveView();
  }

  function renderActiveView() {
    updateDemoBadges();

    switch (state.currentView) {
      case 'dashboard': renderDashboard(); break;
      case 'cave': renderCave(); break;
      case 'boire': renderBoire(); break;
      case 'vin': renderDetailVin(state.selectedWineId); break;
      case 'ajouter': prepareForm(state.editingWineId); break;
      case 'analyse': renderAnalyse(); break;
    }
  }

  function updateDemoBadges() {
    const hasDemo = Storage.hasDemoWines();
    document.getElementById('demo-indicator').classList.toggle('hidden', !hasDemo);
    document.getElementById('demo-indicator-mobile').classList.toggle('hidden', !hasDemo);
  }

  function renderDashboard() {
    document.querySelectorAll('.current-year-text').forEach(el => el.textContent = CURRENT_YEAR);
    const wines = Storage.loadWines();

    let totalBottles = 0;
    let totalValue = 0;
    const domainsSet = new Set();

    wines.forEach(w => {
      const qty = Number(w.stock?.quantite || 0);
      const price = Number(w.achat?.prix_unitaire || 0);
      totalBottles += qty;
      totalValue += (qty * price);
      if (w.identification?.domaine) domainsSet.add(w.identification.domaine.trim().toLowerCase());
    });

    document.getElementById('dash-total-bottles').textContent = totalBottles;
    document.getElementById('dash-total-refs').textContent = wines.length;
    document.getElementById('dash-total-domains').textContent = domainsSet.size;
    document.getElementById('dash-total-value').textContent = totalValue.toLocaleString('fr-FR') + ' €';

    const priorityList = wines.filter(w => {
      if ((w.stock?.quantite || 0) <= 0) return false;
      const st = getWineStatus(w.garde);
      return st.key === 'a-boire' || st.key === 'optimal' || st.key === 'a-surveiller';
    }).slice(0, 4);

    const priorityContainer = document.getElementById('dash-priorities-list');
    priorityContainer.innerHTML = '';
    if (priorityList.length === 0) {
      priorityContainer.innerHTML = '<p class="text-muted" style="font-size:0.85rem;">Aucune priorité immédiate à déguster.</p>';
    } else {
      priorityList.forEach(w => priorityContainer.appendChild(createWineCard(w, true)));
    }

    const recentList = [...wines].reverse().slice(0, 4);
    const recentContainer = document.getElementById('dash-recent-list');
    recentContainer.innerHTML = '';
    if (recentList.length === 0) {
      recentContainer.innerHTML = '<p class="text-muted" style="font-size:0.85rem;">Aucun vin enregistré.</p>';
    } else {
      recentList.forEach(w => recentContainer.appendChild(createWineCard(w, true)));
    }
  }

  function renderCave() {
    const wines = Storage.loadWines();
    populateRegionFilter(wines);

    let filtered = wines.filter(w => {
      if (state.filters.search) {
        const q = state.filters.search.toLowerCase();
        const nom = (w.identification?.nom || '').toLowerCase();
        const dom = (w.identification?.domaine || '').toLowerCase();
        const app = (w.identification?.appellation || '').toLowerCase();
        const cep = (w.identification?.cepages || '').toLowerCase();
        const reg = (w.identification?.region || '').toLowerCase();
        const mil = String(w.identification?.millesime || '');

        if (!nom.includes(q) && !dom.includes(q) && !app.includes(q) && !cep.includes(q) && !reg.includes(q) && !mil.includes(q)) {
          return false;
        }
      }

      if (state.filters.color && w.identification?.couleur !== state.filters.color) return false;
      if (state.filters.region && w.identification?.region !== state.filters.region) return false;
      if (state.filters.status && getWineStatus(w.garde).label !== state.filters.status) return false;
      if (state.filters.onlyFav && !w.favori) return false;

      return true;
    });

    filtered.sort((a, b) => {
      switch (state.filters.sort) {
        case 'nom-asc': return (a.identification?.nom || '').localeCompare(b.identification?.nom || '');
        case 'domaine-asc': return (a.identification?.domaine || '').localeCompare(b.identification?.domaine || '');
        case 'millesime-desc': return (b.identification?.millesime || 0) - (a.identification?.millesime || 0);
        case 'millesime-asc': return (a.identification?.millesime || 0) - (b.identification?.millesime || 0);
        case 'quantite-desc': return (b.stock?.quantite || 0) - (a.stock?.quantite || 0);
        case 'prix-desc': return (b.achat?.prix_unitaire || 0) - (a.achat?.prix_unitaire || 0);
        default: return 0;
      }
    });

    const container = document.getElementById('cave-list');
    container.innerHTML = '';
    document.getElementById('cave-count-text').textContent = `${filtered.length} référence${filtered.length > 1 ? 's' : ''}`;

    if (filtered.length === 0) {
      container.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding: 3rem; color: var(--text-muted);">Aucun vin ne correspond à vos critères.</div>';
      return;
    }

    filtered.forEach(w => container.appendChild(createWineCard(w)));
  }

  function populateRegionFilter(wines) {
    const regionSelect = document.getElementById('filter-region');
    const currentVal = regionSelect.value;
    const regions = new Set();

    wines.forEach(w => {
      if (w.identification?.region) regions.add(w.identification.region.trim());
    });

    regionSelect.innerHTML = '<option value="">Toutes les régions</option>';
    Array.from(regions).sort().forEach(r => {
      const opt = document.createElement('option');
      opt.value = r;
      opt.textContent = r;
      if (r === currentVal) opt.selected = true;
      regionSelect.appendChild(opt);
    });
  }

  function createWineCard(wine) {
    const card = document.createElement('div');
    card.className = 'wine-card';
    card.setAttribute('data-id', wine.id);

    const status = getWineStatus(wine.garde);
    const statusClass = getStatusClass(status.key);
    const qty = wine.stock?.quantite || 0;

    let scoreDisplay = '';
    if (wine.degustations && wine.degustations.length > 0) {
      const lastNote = wine.degustations[wine.degustations.length - 1].note;
      scoreDisplay = ` · <strong>${lastNote}/10</strong>`;
    }

    card.innerHTML = `
      <div class="wine-card-top">
        <div class="badge-group">
          <span class="tag-badge tag-color">${wine.identification.couleur}</span>
          <span class="tag-badge ${statusClass}">${status.label}</span>
        </div>
        <button class="wine-fav-btn ${wine.favori ? 'is-fav' : ''}" data-id="${wine.id}">
          ${wine.favori ? '★' : '☆'}
        </button>
      </div>
      <h3 class="wine-card-nom">${wine.identification.nom}</h3>
      <div class="wine-card-domaine">${wine.identification.domaine}</div>
      <div class="wine-card-meta">
        ${wine.identification.appellation} · ${wine.identification.millesime || 'NV'} · ${wine.identification.region}${scoreDisplay}
      </div>
      <div class="wine-card-bottom">
        <span class="wine-card-stock ${qty === 0 ? 'stock-epuise' : ''}">
          ${qty > 0 ? `${qty} bouteille${qty > 1 ? 's' : ''}` : 'Épuisé'}
        </span>
        <span style="font-size:0.8rem; color:var(--text-muted);">
          ${wine.achat?.prix_unitaire ? `${wine.achat.prix_unitaire} €` : ''}
        </span>
      </div>
    `;

    card.addEventListener('click', (e) => {
      if (e.target.closest('.wine-fav-btn')) return;
      navigateTo('vin', { wineId: wine.id });
    });

    const favBtn = card.querySelector('.wine-fav-btn');
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWineFavori(wine.id);
    });

    return card;
  }

  function toggleWineFavori(id) {
    const wine = Storage.getWineById(id);
    if (!wine) return;
    wine.favori = !wine.favori;
    Storage.updateWine(wine);
    renderActiveView();
  }

  function renderBoire() {
    const wines = Storage.loadWines().filter(w => (w.stock?.quantite || 0) > 0);

    const categories = {
      'a-boire': [],
      'optimal': [],
      'a-surveiller': [],
      'trop-jeune': []
    };

    wines.forEach(w => {
      const st = getWineStatus(w.garde);
      if (categories[st.key]) categories[st.key].push(w);
    });

    const renderList = (containerId, countId, items) => {
      const container = document.getElementById(containerId);
      document.getElementById(countId).textContent = items.length;
      container.innerHTML = '';

      if (items.length === 0) {
        container.innerHTML = '<p class="text-muted" style="font-size:0.85rem; padding: 0.5rem 0;">Aucune bouteille dans cette catégorie.</p>';
        return;
      }
      items.forEach(w => container.appendChild(createWineCard(w)));
    };

    renderList('list-a-boire', 'count-a-boire', categories['a-boire']);
    renderList('list-optimal', 'count-optimal', categories['optimal']);
    renderList('list-a-surveiller', 'count-a-surveiller', categories['a-surveiller']);
    renderList('list-trop-jeune', 'count-trop-jeune', categories['trop-jeune']);
  }

  function renderDetailVin(id) {
    const wine = Storage.getWineById(id);
    if (!wine) {
      navigateTo('cave');
      return;
    }

    document.getElementById('wine-detail-nom').textContent = wine.identification.nom;
    document.getElementById('wine-detail-domaine').textContent = wine.identification.domaine;
    document.getElementById('wine-detail-appellation-line').textContent = 
      `${wine.identification.appellation} · ${wine.identification.millesime} · ${wine.identification.region}`;

    const status = getWineStatus(wine.garde);
    document.getElementById('wine-detail-badges').innerHTML = `
      <span class="tag-badge tag-color">${wine.identification.couleur}</span>
      <span class="tag-badge ${getStatusClass(status.key)}">${status.label}</span>
      ${wine.stock.quantite === 0 ? '<span class="tag-badge tag-status-a-surveiller">Stock Épuisé</span>' : ''}
    `;

    const favBtn = document.getElementById('wine-detail-fav-btn');
    favBtn.textContent = wine.favori ? '★' : '☆';
    favBtn.className = `btn btn-icon ${wine.favori ? 'is-fav' : ''}`;
    favBtn.onclick = () => {
      toggleWineFavori(wine.id);
      renderDetailVin(wine.id);
    };

    document.getElementById('wine-detail-qty').textContent = wine.stock.quantite;
    document.getElementById('btn-stock-minus').onclick = () => adjustStock(wine.id, -1);
    document.getElementById('btn-stock-plus').onclick = () => adjustStock(wine.id, 1);
    document.getElementById('btn-consume-bottle').onclick = () => consumeBottle(wine.id);

    document.getElementById('wine-detail-couleur').textContent = wine.identification.couleur;
    document.getElementById('wine-detail-millesime').textContent = wine.identification.millesime || '-';
    document.getElementById('wine-detail-region-pays').textContent = `${wine.identification.region} (${wine.identification.pays || 'France'})`;
    document.getElementById('wine-detail-cepages').textContent = wine.identification.cepages || 'Non renseigné';
    document.getElementById('wine-detail-classification').textContent = wine.identification.classification || 'Aucune';
    document.getElementById('wine-detail-contenance').textContent = `${wine.identification.contenance || 75} cl`;

    document.getElementById('wine-detail-emplacement').textContent = wine.stock.emplacement || 'Non spécifié';
    document.getElementById('wine-detail-prix').textContent = wine.achat.prix_unitaire ? `${wine.achat.prix_unitaire} €` : '-';
    document.getElementById('wine-detail-valeur-totale').textContent = wine.achat.prix_unitaire ? `${wine.achat.prix_unitaire * wine.stock.quantite} €` : '-';
    document.getElementById('wine-detail-date-achat').textContent = wine.achat.date || '-';
    document.getElementById('wine-detail-vendeur').textContent = wine.achat.vendeur || '-';

    renderGardeTimeline(wine.garde);
    renderDegustations(wine);
    renderHistory(wine.historique || []);

    document.getElementById('wine-detail-edit-btn').onclick = () => {
      state.editingWineId = wine.id;
      navigateTo('ajouter');
    };

    document.getElementById('wine-detail-delete-btn').onclick = () => {
      if (confirm(`Supprimer définitivement "${wine.identification.nom}" ?`)) {
        Storage.deleteWine(wine.id);
        navigateTo('cave');
      }
    };
  }

  function adjustStock(wineId, delta) {
    const wine = Storage.getWineById(wineId);
    if (!wine) return;
    const currentQty = wine.stock.quantite || 0;
    const newQty = Math.max(0, currentQty + delta);

    if (newQty === currentQty) return;

    wine.stock.quantite = newQty;
    wine.historique.unshift({
      date: new Date().toISOString().split('T')[0],
      type: "Stock",
      note: `${delta > 0 ? '+' : ''}${delta} bouteille(s) (Nouveau stock : ${newQty})`
    });

    Storage.updateWine(wine);
    renderDetailVin(wineId);
  }

  function consumeBottle(wineId) {
    const wine = Storage.getWineById(wineId);
    if (!wine) return;
    if (wine.stock.quantite <= 0) {
      alert("Stock déjà épuisé.");
      return;
    }

    wine.stock.quantite -= 1;
    wine.historique.unshift({
      date: new Date().toISOString().split('T')[0],
      type: "Consommation",
      note: `1 bouteille consommée (Reste : ${wine.stock.quantite})`
    });

    Storage.updateWine(wine);
    renderDetailVin(wineId);

    const inlineForm = document.getElementById('form-degustation-inline');
    inlineForm.classList.remove('hidden');
    document.getElementById('deg-date').value = new Date().toISOString().split('T')[0];
  }

  function renderGardeTimeline(garde) {
    const container = document.getElementById('garde-timeline-container');
    if (!garde || !garde.debut || !garde.fin) {
      container.innerHTML = '<p class="text-muted" style="font-size:0.85rem;">Aucune fenêtre de garde définie.</p>';
      return;
    }

    const { debut, optimal_debut, optimal_fin, fin } = garde;
    const optStart = optimal_debut || debut;
    const optEnd = optimal_fin || fin;

    const totalYears = Math.max(1, fin - debut);
    const optLeftPercent = Math.max(0, Math.min(100, ((optStart - debut) / totalYears) * 100));
    const optWidthPercent = Math.max(0, Math.min(100 - optLeftPercent, ((optEnd - optStart) / totalYears) * 100));

    let currentPercent = ((CURRENT_YEAR - debut) / totalYears) * 100;
    currentPercent = Math.max(-2, Math.min(102, currentPercent));

    container.innerHTML = `
      <div class="timeline-bar-bg">
        <div class="timeline-opt-segment" style="left: ${optLeftPercent}%; width: ${optWidthPercent}%;"></div>
        <div class="timeline-cursor-now" style="left: ${currentPercent}%;">
          <span class="timeline-cursor-label">${CURRENT_YEAR}</span>
        </div>
      </div>
      <div class="timeline-milestones">
        <div class="timeline-milestone"><span>Début</span><strong>${debut}</strong></div>
        <div class="timeline-milestone"><span>Début optimal</span><strong>${optimal_debut || '-'}</strong></div>
        <div class="timeline-milestone"><span>Fin optimale</span><strong>${optimal_fin || '-'}</strong></div>
        <div class="timeline-milestone"><span>Fin de garde</span><strong>${fin}</strong></div>
      </div>
    `;
  }

  function renderDegustations(wine) {
    const listContainer = document.getElementById('wine-degustations-list');
    document.getElementById('wine-degustations-count').textContent = (wine.degustations || []).length;
    listContainer.innerHTML = '';

    if (!wine.degustations || wine.degustations.length === 0) {
      listContainer.innerHTML = '<p class="text-muted" style="font-size:0.85rem;">Aucune dégustation enregistrée.</p>';
    } else {
      [...wine.degustations].reverse().forEach(d => {
        const item = document.createElement('div');
        item.className = 'note-item';
        item.innerHTML = `
          <div class="note-header">
            <span class="note-score">${d.note !== null && d.note !== undefined ? `${d.note} / 10` : 'Non noté'}</span>
            <span style="font-size:0.8rem; color:var(--text-muted);">${d.date || '-'}</span>
          </div>
          ${d.commentaire ? `<p style="font-size:0.88rem; margin-bottom:0.25rem;">${d.commentaire}</p>` : ''}
          ${d.accords ? `<p style="font-size:0.78rem; color:var(--text-muted);"><strong>Accords :</strong> ${d.accords}</p>` : ''}
        `;
        listContainer.appendChild(item);
      });
    }

    const inlineForm = document.getElementById('form-degustation-inline');
    document.getElementById('btn-add-degustation').onclick = () => {
      inlineForm.classList.remove('hidden');
      document.getElementById('deg-date').value = new Date().toISOString().split('T')[0];
    };

    document.getElementById('btn-cancel-degustation').onclick = () => inlineForm.classList.add('hidden');

    document.getElementById('btn-save-degustation').onclick = () => {
      const noteVal = document.getElementById('deg-note').value;
      const dateVal = document.getElementById('deg-date').value;
      const commVal = document.getElementById('deg-commentaire').value;
      const accordsVal = document.getElementById('deg-accords').value;

      const newDeg = {
        id: 'deg_' + Date.now(),
        date: dateVal || new Date().toISOString().split('T')[0],
        note: noteVal !== '' ? parseFloat(noteVal) : null,
        commentaire: commVal.trim(),
        accords: accordsVal.trim()
      };

      if (!wine.degustations) wine.degustations = [];
      wine.degustations.push(newDeg);

      wine.historique.unshift({
        date: newDeg.date,
        type: "Dégustation",
        note: `Note attribuée : ${newDeg.note !== null ? newDeg.note + '/10' : 'sans note'}`
      });

      Storage.updateWine(wine);
      inlineForm.classList.add('hidden');
      document.getElementById('deg-note').value = '';
      document.getElementById('deg-commentaire').value = '';
      document.getElementById('deg-accords').value = '';
      renderDetailVin(wine.id);
    };
  }

  function renderHistory(history) {
    const listContainer = document.getElementById('wine-history-list');
    listContainer.innerHTML = '';

    if (!history || history.length === 0) {
      listContainer.innerHTML = '<li class="text-muted" style="font-size:0.85rem;">Aucun événement consigné.</li>';
      return;
    }

    history.forEach(h => {
      const li = document.createElement('li');
      li.className = 'history-item';
      li.innerHTML = `
        <span class="history-date">${h.date}</span>
        <span><strong>${h.type}</strong> — ${h.note || ''}</span>
      `;
      listContainer.appendChild(li);
    });
  }

  function prepareForm(wineId = null) {
    const form = document.getElementById('wine-form');
    form.reset();

    if (wineId) {
      document.getElementById('form-title').textContent = "Modifier la référence";
      const wine = Storage.getWineById(wineId);
      if (!wine) return;

      document.getElementById('form-wine-id').value = wine.id;
      document.getElementById('form-nom').value = wine.identification.nom || '';
      document.getElementById('form-domaine').value = wine.identification.domaine || '';
      document.getElementById('form-appellation').value = wine.identification.appellation || '';
      document.getElementById('form-region').value = wine.identification.region || '';
      document.getElementById('form-pays').value = wine.identification.pays || 'France';
      document.getElementById('form-couleur').value = wine.identification.couleur || 'Rouge';
      document.getElementById('form-millesime').value = wine.identification.millesime || '';
      document.getElementById('form-contenance').value = wine.identification.contenance || 75;
      document.getElementById('form-cepages').value = wine.identification.cepages || '';
      document.getElementById('form-classification').value = wine.identification.classification || '';

      document.getElementById('form-quantite').value = wine.stock.quantite || 0;
      document.getElementById('form-emplacement').value = wine.stock.emplacement || '';
      document.getElementById('form-prix').value = wine.achat.prix_unitaire || '';
      document.getElementById('form-date-achat').value = wine.achat.date || '';
      document.getElementById('form-vendeur').value = wine.achat.vendeur || '';

      document.getElementById('form-garde-debut').value = wine.garde.debut || '';
      document.getElementById('form-garde-opt-debut').value = wine.garde.optimal_debut || '';
      document.getElementById('form-garde-opt-fin').value = wine.garde.optimal_fin || '';
      document.getElementById('form-garde-fin').value = wine.garde.fin || '';
    } else {
      document.getElementById('form-title').textContent = "Ajouter une référence";
      document.getElementById('form-wine-id').value = '';
      document.getElementById('form-contenance').value = 75;
      document.getElementById('form-quantite').value = 1;
      document.getElementById('form-pays').value = 'France';
      document.getElementById('form-couleur').value = 'Rouge';
      document.getElementById('form-date-achat').value = new Date().toISOString().split('T')[0];
    }
  }

  document.getElementById('wine-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const wineId = document.getElementById('form-wine-id').value;
    const nom = document.getElementById('form-nom').value.trim();
    const domaine = document.getElementById('form-domaine').value.trim();
    const appellation = document.getElementById('form-appellation').value.trim();
    const region = document.getElementById('form-region').value.trim();
    const millesime = parseInt(document.getElementById('form-millesime').value, 10);
    const quantite = parseInt(document.getElementById('form-quantite').value, 10);

    if (!nom || !domaine || !appellation || !region || isNaN(millesime)) {
      alert("Veuillez renseigner les champs obligatoires (Nom, Domaine, Appellation, Région, Millésime).");
      return;
    }

    const payload = {
      identification: {
        nom,
        domaine,
        appellation,
        region,
        pays: document.getElementById('form-pays').value.trim() || 'France',
        couleur: document.getElementById('form-couleur').value,
        millesime,
        cepages: document.getElementById('form-cepages').value.trim(),
        classification: document.getElementById('form-classification').value.trim(),
        contenance: parseInt(document.getElementById('form-contenance').value, 10) || 75
      },
      stock: {
        quantite: isNaN(quantite) ? 0 : quantite,
        emplacement: document.getElementById('form-emplacement').value.trim()
      },
      achat: {
        date: document.getElementById('form-date-achat').value,
        prix_unitaire: parseFloat(document.getElementById('form-prix').value) || 0,
        vendeur: document.getElementById('form-vendeur').value.trim()
      },
      garde: {
        debut: parseInt(document.getElementById('form-garde-debut').value, 10) || null,
        optimal_debut: parseInt(document.getElementById('form-garde-opt-debut').value, 10) || null,
        optimal_fin: parseInt(document.getElementById('form-garde-opt-fin').value, 10) || null,
        fin: parseInt(document.getElementById('form-garde-fin').value, 10) || null
      },
      favori: false
    };

    if (wineId) {
      const existing = Storage.getWineById(wineId);
      Storage.updateWine({
        ...existing,
        ...payload,
        id: wineId,
        historique: existing.historique || [],
        degustations: existing.degustations || []
      });
      state.editingWineId = null;
      navigateTo('vin', { wineId });
    } else {
      payload.degustations = [];
      const noteInit = document.getElementById('form-note').value;
      const commInit = document.getElementById('form-commentaire').value;
      const accordsInit = document.getElementById('form-accords').value;

      if (noteInit || commInit || accordsInit) {
        payload.degustations.push({
          id: 'deg_' + Date.now(),
          date: new Date().toISOString().split('T')[0],
          note: noteInit ? parseFloat(noteInit) : null,
          commentaire: commInit.trim(),
          accords: accordsInit.trim()
        });
      }

      const created = Storage.addWine(payload);
      navigateTo('vin', { wineId: created.id });
    }
  });

  document.getElementById('btn-cancel-wine-form').addEventListener('click', () => {
    if (state.editingWineId) {
      navigateTo('vin', { wineId: state.editingWineId });
      state.editingWineId = null;
    } else {
      navigateTo('cave');
    }
  });

  function renderAnalyse() {
    const wines = Storage.loadWines();
    let totalBottles = 0;
    const parCouleur = {}, parGarde = {}, parRegion = {}, parMillesime = {};

    wines.forEach(w => {
      const q = w.stock?.quantite || 0;
      totalBottles += q;

      const c = w.identification?.couleur || 'Inconnue';
      parCouleur[c] = (parCouleur[c] || 0) + q;

      const st = getWineStatus(w.garde).label;
      parGarde[st] = (parGarde[st] || 0) + q;

      const r = w.identification?.region || 'Inconnue';
      parRegion[r] = (parRegion[r] || 0) + q;

      const m = w.identification?.millesime || 'NV';
      parMillesime[m] = (parMillesime[m] || 0) + q;
    });

    const renderBars = (elementId, dataMap) => {
      const el = document.getElementById(elementId);
      el.innerHTML = '';

      if (totalBottles === 0) {
        el.innerHTML = '<p class="text-muted" style="font-size:0.85rem;">Aucune bouteille disponible pour calcul.</p>';
        return;
      }

      const sorted = Object.entries(dataMap).sort((a, b) => b[1] - a[1]);
      sorted.forEach(([key, count]) => {
        const pct = Math.round((count / totalBottles) * 100);
        const item = document.createElement('div');
        item.className = 'stat-bar-item';
        item.innerHTML = `
          <div class="stat-bar-header">
            <span><strong>${key}</strong> (${count} bt.)</span>
            <span>${pct}%</span>
          </div>
          <div class="stat-bar-track">
            <div class="stat-bar-fill" style="width: ${pct}%;"></div>
          </div>
        `;
        el.appendChild(item);
      });
    };

    renderBars('stats-couleur-list', parCouleur);
    renderBars('stats-garde-list', parGarde);
    renderBars('stats-region-list', parRegion);
    renderBars('stats-millesime-list', parMillesime);
  }

  document.getElementById('btn-export-json').addEventListener('click', () => {
    const wines = Storage.loadWines();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(wines, null, 2));
    const downloadAnchor = document.createElement('a');
    const today = new Date().toISOString().split('T')[0];
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ma-cave-${today}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  });

  const fileInput = document.getElementById('input-import-json');
  document.getElementById('btn-trigger-import').addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (!Array.isArray(parsed)) throw new Error("Format JSON invalide.");
        if (confirm(`Remplacer toutes les références actuelles par les ${parsed.length} vins trouvés ?`)) {
          Storage.saveWines(parsed);
          alert("Importation réussie.");
          navigateTo('dashboard');
        }
      } catch (err) {
        alert("Erreur lors de la lecture : " + err.message);
      }
    };
    reader.readAsText(file);
    fileInput.value = '';
  });

  document.getElementById('btn-reset-demo').addEventListener('click', () => {
    if (confirm("Recharger les données fictives ?")) {
      Storage.resetDemo();
      navigateTo('dashboard');
    }
  });

  document.getElementById('btn-purge-demo').addEventListener('click', () => {
    if (confirm("Supprimer les données de démonstration ?")) {
      Storage.purgeDemo();
      navigateTo('dashboard');
    }
  });

  document.getElementById('btn-clear-all').addEventListener('click', () => {
    if (confirm("Supprimer irréversiblement toute votre cave ?")) {
      Storage.clearAll();
      navigateTo('dashboard');
    }
  });

  document.querySelectorAll('[data-view]').forEach(elem => {
    elem.addEventListener('click', () => {
      const view = elem.getAttribute('data-view');
      if (view === 'ajouter') state.editingWineId = null;
      navigateTo(view);
    });
  });

  document.getElementById('btn-back-cave').addEventListener('click', () => navigateTo('cave'));

  document.getElementById('filter-search').addEventListener('input', (e) => {
    state.filters.search = e.target.value;
    renderCave();
  });

  document.getElementById('filter-color').addEventListener('change', (e) => {
    state.filters.color = e.target.value;
    renderCave();
  });

  document.getElementById('filter-region').addEventListener('change', (e) => {
    state.filters.region = e.target.value;
    renderCave();
  });

  document.getElementById('filter-status').addEventListener('change', (e) => {
    state.filters.status = e.target.value;
    renderCave();
  });

  document.getElementById('filter-sort').addEventListener('change', (e) => {
    state.filters.sort = e.target.value;
    renderCave();
  });

  const favFilterBtn = document.getElementById('filter-fav-btn');
  favFilterBtn.addEventListener('click', () => {
    state.filters.onlyFav = !state.filters.onlyFav;
    favFilterBtn.classList.toggle('active', state.filters.onlyFav);
    renderCave();
  });

  navigateTo('dashboard');
});