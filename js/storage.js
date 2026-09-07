const STORAGE_KEY = 'ma_cave_vins_data';
const GIST_META_KEY = 'ma_cave_gist_meta';
const GIST_FILENAME = 'ma_cave_data.json';

const DEMO_WINES = [
  {
    id: "wine_demo_01",
    isDemo: true,
    favori: true,
    identification: {
      nom: "Château Haut-Batailley",
      domaine: "Château Haut-Batailley",
      appellation: "Pauillac",
      region: "Bordeaux",
      pays: "France",
      couleur: "Rouge",
      millesime: 2018,
      cepages: "Cabernet Sauvignon, Merlot",
      classification: "5e Grand Cru Classé",
      contenance: 75
    },
    stock: { quantite: 3, emplacement: "Cave B - Étagère 2" },
    achat: { date: "2024-04-12", prix_unitaire: 58, vendeur: "Millesima" },
    garde: { debut: 2023, optimal_debut: 2026, optimal_fin: 2034, fin: 2038 },
    degustations: [
      {
        id: "deg_1",
        date: "2025-11-15",
        note: 9,
        commentaire: "Grand équilibre, tanins soyeux, fruits noirs et cèdre.",
        accords: "Côte de bœuf maturée"
      }
    ],
    historique: [
      { date: "2024-04-12", type: "Achat", note: "+4 bouteilles" },
      { date: "2025-11-15", type: "Consommation", note: "Dégustation annuelle (-1)" }
    ]
  },
  {
    id: "wine_demo_02",
    isDemo: true,
    favori: true,
    identification: {
      nom: "Meursault Les Narvaux",
      domaine: "Domaine Vincent Girardin",
      appellation: "Meursault",
      region: "Bourgogne",
      pays: "France",
      couleur: "Blanc",
      millesime: 2020,
      cepages: "Chardonnay",
      classification: "Village",
      contenance: 75
    },
    stock: { quantite: 2, emplacement: "Cave A - Casier 1" },
    achat: { date: "2023-09-10", prix_unitaire: 72, vendeur: "Caviste local" },
    garde: { debut: 2023, optimal_debut: 2025, optimal_fin: 2028, fin: 2030 },
    degustations: [],
    historique: [{ date: "2023-09-10", type: "Achat", note: "+2 bouteilles" }]
  },
  {
    id: "wine_demo_03",
    isDemo: true,
    favori: false,
    identification: {
      nom: "Saint-Joseph 'Offerus'",
      domaine: "Jean-Louis Chave Sélection",
      appellation: "Saint-Joseph",
      region: "Rhône",
      pays: "France",
      couleur: "Rouge",
      millesime: 2021,
      cepages: "Syrah",
      classification: "AOC",
      contenance: 75
    },
    stock: { quantite: 5, emplacement: "Cave B - Étagère 4" },
    achat: { date: "2024-02-18", prix_unitaire: 29, vendeur: "Vente directe domaine" },
    garde: { debut: 2024, optimal_debut: 2025, optimal_fin: 2029, fin: 2032 },
    degustations: [],
    historique: [{ date: "2024-02-18", type: "Achat", note: "+5 bouteilles" }]
  },
  {
    id: "wine_demo_04",
    isDemo: true,
    favori: false,
    identification: {
      nom: "Clos de la Coulée de Serrant",
      domaine: "Nicolas Joly",
      appellation: "Savennières",
      region: "Loire",
      pays: "France",
      couleur: "Blanc",
      millesime: 2019,
      cepages: "Chenin Blanc",
      classification: "AOC Monopole",
      contenance: 75
    },
    stock: { quantite: 1, emplacement: "Cave A - Casier 3" },
    achat: { date: "2022-10-01", prix_unitaire: 95, vendeur: "Caviste" },
    garde: { debut: 2024, optimal_debut: 2027, optimal_fin: 2036, fin: 2042 },
    degustations: [],
    historique: [{ date: "2022-10-01", type: "Achat", note: "+1 bouteille" }]
  },
  {
    id: "wine_demo_05",
    isDemo: true,
    favori: true,
    identification: {
      nom: "Grande Réserve Brut",
      domaine: "Champagne Gosset",
      appellation: "Champagne",
      region: "Champagne",
      pays: "France",
      couleur: "Effervescent",
      millesime: 2017,
      cepages: "Chardonnay, Pinot Noir, Pinot Meunier",
      classification: "Brut",
      contenance: 75
    },
    stock: { quantite: 4, emplacement: "Cave Fraîche" },
    achat: { date: "2025-01-20", prix_unitaire: 46, vendeur: "Club Vin" },
    garde: { debut: 2022, optimal_debut: 2023, optimal_fin: 2026, fin: 2028 },
    degustations: [],
    historique: [{ date: "2025-01-20", type: "Achat", note: "+4 bouteilles" }]
  },
  {
    id: "wine_demo_06",
    isDemo: true,
    favori: false,
    identification: {
      nom: "Château Simone Rosé",
      domaine: "Domaine de Simone",
      appellation: "Palette",
      region: "Provence",
      pays: "France",
      couleur: "Rosé",
      millesime: 2022,
      cepages: "Grenache, Mourvèdre, Cinsault",
      classification: "AOC",
      contenance: 75
    },
    stock: { quantite: 2, emplacement: "Cave B - Étagère 1" },
    achat: { date: "2024-06-05", prix_unitaire: 42, vendeur: "La Vinothèque" },
    garde: { debut: 2023, optimal_debut: 2024, optimal_fin: 2027, fin: 2029 },
    degustations: [],
    historique: [{ date: "2024-06-05", type: "Achat", note: "+2 bouteilles" }]
  },
  {
    id: "wine_demo_07",
    isDemo: true,
    favori: false,
    identification: {
      nom: "Château Coutet",
      domaine: "Château Coutet",
      appellation: "Barsac",
      region: "Bordeaux",
      pays: "France",
      couleur: "Liquoreux",
      millesime: 2011,
      cepages: "Sémillon, Sauvignon Blanc",
      classification: "1er Cru Classé 1855",
      contenance: 75
    },
    stock: { quantite: 1, emplacement: "Cave A - Casier Réserve" },
    achat: { date: "2021-12-10", prix_unitaire: 55, vendeur: "Vente aux enchères" },
    garde: { debut: 2016, optimal_debut: 2020, optimal_fin: 2035, fin: 2045 },
    degustations: [],
    historique: [{ date: "2021-12-10", type: "Achat", note: "+1 bouteille" }]
  },
  {
    id: "wine_demo_08",
    isDemo: true,
    favori: false,
    identification: {
      nom: "Cornas 'Brise Cailloux'",
      domaine: "Domaine du Coulet",
      appellation: "Cornas",
      region: "Rhône",
      pays: "France",
      couleur: "Rouge",
      millesime: 2023,
      cepages: "Syrah",
      classification: "Biodynamie",
      contenance: 75
    },
    stock: { quantite: 6, emplacement: "Cave B - Étagère 5" },
    achat: { date: "2025-05-14", prix_unitaire: 48, vendeur: "Domaine" },
    garde: { debut: 2028, optimal_debut: 2030, optimal_fin: 2038, fin: 2042 },
    degustations: [],
    historique: [{ date: "2025-05-14", type: "Achat", note: "+6 bouteilles" }]
  },
  {
    id: "wine_demo_09",
    isDemo: true,
    favori: false,
    identification: {
      nom: "Morgon Côte du Py",
      domaine: "Jean Foillard",
      appellation: "Morgon",
      region: "Beaujolais",
      pays: "France",
      couleur: "Rouge",
      millesime: 2015,
      cepages: "Gamay",
      classification: "Nature",
      contenance: 75
    },
    stock: { quantite: 1, emplacement: "Cave A - Casier Rapide" },
    achat: { date: "2020-03-12", prix_unitaire: 24, vendeur: "Caviste" },
    garde: { debut: 2018, optimal_debut: 2020, optimal_fin: 2024, fin: 2025 },
    degustations: [],
    historique: [
      { date: "2020-03-12", type: "Achat", note: "+2 bouteilles" },
      { date: "2023-08-01", type: "Consommation", note: "Bouteille bue (-1)" }
    ]
  }
];

// --- Client minimal pour GitHub Gists ---
class GistClient {
  constructor(token = null, gistId = null) {
    this.token = token;
    this.gistId = gistId;
  }

  setToken(token) {
    this.token = token;
  }

  setGistId(gistId) {
    this.gistId = gistId;
  }

  async _request(path, method = 'GET', body = null) {
    const headers = { Accept: 'application/vnd.github+json' };
    if (this.token) headers.Authorization = `token ${this.token}`;
    const opts = { method, headers };
    if (body) {
      opts.body = JSON.stringify(body);
      headers['Content-Type'] = 'application/json';
    }
    const res = await fetch(`https://api.github.com${path}`, opts);
    if (!res.ok) {
      const txt = await res.text();
      const err = new Error(`Gist API error ${res.status}: ${txt}`);
      err.status = res.status;
      throw err;
    }
    return res.json();
  }

  // Lire le contenu du gist (retourne un tableau d'objets vins)
  async fetchGistData() {
    if (!this.gistId) throw new Error('gistId not set');
    const json = await this._request(`/gists/${this.gistId}`, 'GET');
    const fileObj = (json.files && (json.files[GIST_FILENAME] || Object.values(json.files)[0]));
    if (!fileObj || !fileObj.content) return null;
    try {
      return JSON.parse(fileObj.content);
    } catch (e) {
      throw new Error('Erreur parsing JSON du Gist: ' + e.message);
    }
  }

  // Créer un gist privé avec le contenu (retourne l'objet gist)
  async createGist(data, isPublic = false) {
    if (!this.token) throw new Error('token required to create gist');
    const body = {
      public: !!isPublic,
      files: {
        [GIST_FILENAME]: {
          content: JSON.stringify(data, null, 2)
        }
      },
      description: 'ma-cave vins data (automatique)'
    };
    const json = await this._request('/gists', 'POST', body);
    this.gistId = json.id;
    return json;
  }

  // Mettre à jour un gist existant
  async updateGist(data) {
    if (!this.token) throw new Error('token required to update gist');
    if (!this.gistId) throw new Error('gistId not set');
    const body = {
      files: {
        [GIST_FILENAME]: {
          content: JSON.stringify(data, null, 2)
        }
      }
    };
    const json = await this._request(`/gists/${this.gistId}`, 'PATCH', body);
    return json;
  }
}

// --- Storage avec support Gist + fallback localStorage ---
const Storage = {
  gistClient: null,

  // configureGist: appel de votre UI pour fournir token et/ou gistId
  configureGist({ token = null, gistId = null } = {}) {
    if (!this.gistClient) this.gistClient = new GistClient(token, gistId);
    else {
      if (token) this.gistClient.setToken(token);
      if (gistId) this.gistClient.setGistId(gistId);
    }
    // stocker en meta local pour persistance UI légère (optionnel)
    localStorage.setItem(GIST_META_KEY, JSON.stringify({ gistId: this.gistClient.gistId || null }));
  },

  // restore gist meta depuis localStorage (au démarrage de l'app)
  restoreGistMeta() {
    try {
      const raw = localStorage.getItem(GIST_META_KEY);
      if (!raw) return;
      const meta = JSON.parse(raw);
      if (meta && meta.gistId) {
        if (!this.gistClient) this.gistClient = new GistClient(null, meta.gistId);
        else this.gistClient.setGistId(meta.gistId);
      }
    } catch (e) {
      // ignore
    }
  },

  // Créer gist à partir des données locales (util pour migration)
  async migrateLocalToGist({ token, isPublic = false } = {}) {
    // require token
    if (!token) throw new Error('Token GitHub requis pour créer le Gist');
    const local = this._loadLocal();
    this.configureGist({ token, gistId: null });
    const res = await this.gistClient.createGist(local, isPublic);
    // sauvegarder la gistId en meta
    localStorage.setItem(GIST_META_KEY, JSON.stringify({ gistId: res.id }));
    return res;
  },

  // Chargement (préférer gist si configuré)
  async loadWines() {
    // restore meta if present
    this.restoreGistMeta();

    // si gistClient est configuré avec token+gistId -> essayer de lire
    if (this.gistClient && this.gistClient.gistId && this.gistClient.token) {
      try {
        const data = await this.gistClient.fetchGistData();
        if (!data) {
          // si gist existe mais vide : initialiser demo
          await this.gistClient.updateGist(DEMO_WINES);
          return DEMO_WINES;
        }
        return data;
      } catch (e) {
        console.error('Erreur lecture Gist, fallback localStorage', e);
        return this._loadLocal();
      }
    }

    // si gistId sans token -> essayer lecture publique (non-auth)
    if (this.gistClient && this.gistClient.gistId && !this.gistClient.token) {
      try {
        const data = await this.gistClient.fetchGistData();
        return data || this._loadLocal();
      } catch (e) {
        console.error('Erreur lecture Gist publique, fallback localStorage', e);
        return this._loadLocal();
      }
    }

    // fallback local
    return this._loadLocal();
  },

  // Sauvegarde (essaie gist si token présent, sinon localStorage)
  async saveWines(wines) {
    // sauvegarde locale immédiate (pour robustesse)
    this._saveLocal(wines);

    // si gist configuré avec token -> try create or update
    if (this.gistClient && this.gistClient.token) {
      try {
        if (!this.gistClient.gistId) {
          const res = await this.gistClient.createGist(wines, false);
          localStorage.setItem(GIST_META_KEY, JSON.stringify({ gistId: res.id }));
        } else {
          await this.gistClient.updateGist(wines);
        }
        return true;
      } catch (e) {
        console.error('Erreur sauvegarde Gist, données restent en local', e);
        return false;
      }
    }

    // no token -> nothing more to do
    return true;
  },

  // opérations CRUD reprenant l'API existante :
  _loadLocal() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      this._saveLocal(DEMO_WINES);
      return DEMO_WINES;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error("Erreur de parsing localStorage", e);
      return [];
    }
  },

  _saveLocal(wines) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wines));
  },

  getWineById(id) {
    const wines = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return wines.find(w => w.id === id) || null;
  },

  async addWine(wineData) {
    const wines = await this.loadWines();
    const newWine = {
      ...wineData,
      id: "wine_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      isDemo: false,
      historique: [
        {
          date: new Date().toISOString().split('T')[0],
          type: "Création",
          note: `Entrée en cave (+${wineData.stock?.quantite || 0})`
        }
      ]
    };
    wines.unshift(newWine);
    await this.saveWines(wines);
    return newWine;
  },

  async updateWine(updatedWine) {
    const wines = await this.loadWines();
    const index = wines.findIndex(w => w.id === updatedWine.id);
    if (index !== -1) {
      wines[index] = updatedWine;
      await this.saveWines(wines);
      return true;
    }
    return false;
  },

  async deleteWine(id) {
    let wines = await this.loadWines();
    wines = wines.filter(w => w.id !== id);
    await this.saveWines(wines);
  },

  resetDemo() {
    this.saveWines(DEMO_WINES);
  },

  purgeDemo() {
    const wines = this._loadLocal().filter(w => !w.isDemo);
    this.saveWines(wines);
  },

  clearAll() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(GIST_META_KEY);
  },

  hasDemoWines() {
    const wines = this._loadLocal();
    return wines.some(w => w.isDemo);
  }
};

if (typeof window !== 'undefined') {
  window.Storage = Storage;
}
