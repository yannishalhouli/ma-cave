const STORAGE_KEY = 'ma_cave_vins_data';

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

const Storage = {
  loadWines() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      this.saveWines(DEMO_WINES);
      return DEMO_WINES;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error("Erreur de parsing", e);
      return [];
    }
  },

  saveWines(wines) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wines));
  },

  getWineById(id) {
    const wines = this.loadWines();
    return wines.find(w => w.id === id) || null;
  },

  addWine(wineData) {
    const wines = this.loadWines();
    const newWine = {
      ...wineData,
      id: "wine_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      isDemo: false,
      historique: [
        {
          date: new Date().toISOString().split('T')[0],
          type: "Création",
          note: `Entrée en cave (+${wineData.stock.quantite})`
        }
      ]
    };
    wines.unshift(newWine);
    this.saveWines(wines);
    return newWine;
  },

  updateWine(updatedWine) {
    const wines = this.loadWines();
    const index = wines.findIndex(w => w.id === updatedWine.id);
    if (index !== -1) {
      wines[index] = updatedWine;
      this.saveWines(wines);
      return true;
    }
    return false;
  },

  deleteWine(id) {
    let wines = this.loadWines();
    wines = wines.filter(w => w.id !== id);
    this.saveWines(wines);
  },

  resetDemo() {
    this.saveWines(DEMO_WINES);
  },

  purgeDemo() {
    let wines = this.loadWines();
    wines = wines.filter(w => !w.isDemo);
    this.saveWines(wines);
  },

  clearAll() {
    localStorage.removeItem(STORAGE_KEY);
  },

  hasDemoWines() {
    const wines = this.loadWines();
    return wines.some(w => w.isDemo);
  }
};