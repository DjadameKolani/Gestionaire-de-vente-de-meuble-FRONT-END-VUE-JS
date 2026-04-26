<script setup>
import UtilisateurTopbar from '@/components/Utilisateur/UtilisateurTopbar.vue'

import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { produitService } from '../../services/produitService.js'
import { formatPrix } from '../../utils/formatPrix.js' // ✅ FCFA

const router = useRouter()
const produits = ref([])
const loading = ref(false)
const erreur = ref('')
const recherche = ref('')

onMounted(async () => {
  loading.value = true
  try {
    produits.value = await produitService.getTousProduits()
  } catch (err) {
    erreur.value = 'Impossible de charger les produits.'
    console.error(err)
  } finally {
    loading.value = false
  }
})

// ✅ Filtrage par recherche
const produitsFiltres = computed(() => {
  if (!recherche.value) return produits.value
  return produits.value.filter((p) => p.nom.toLowerCase().includes(recherche.value.toLowerCase()))
})

function getImageUrl(produit) {
  if (produit.imageUrl) return `http://localhost:8080${produit.imageUrl}`
  return '/assets/images/product-1.png'
}

function goToCard(produit) {
  const token = localStorage.getItem('token')
  if (!token) {
    localStorage.setItem('produitEnAttente', JSON.stringify(produit))
    router.push('/connection')
    return
  }
  if (produit.quantite <= 0) {
    alert('Ce produit est en rupture de stock')
    return
  }
  ajouterAuPanier(produit)
  router.push({ name: 'Card' })
}

function ajouterAuPanier(produit) {
  const panier = JSON.parse(localStorage.getItem('panier') || '[]')
  const existant = panier.find((p) => p.id === produit.id)
  if (existant) {
    if (existant.quantite >= produit.quantite) {
      alert(`Stock maximum atteint (${produit.quantite} disponible)`)
      return
    }
    existant.quantite += 1
  } else {
    panier.push({
      id: produit.id,
      nom: produit.nom,
      prix: produit.prix,
      imageUrl: produit.imageUrl,
      quantiteDisponible: produit.quantite, // ✅ stock réel
      quantite: 1,
    })
  }
  localStorage.setItem('panier', JSON.stringify(panier))
}
</script>

<template>
  <UtilisateurTopbar />

  <!-- Hero -->
  <div class="shop-hero">
    <div class="container">
      <h1>Notre Boutique</h1>
      <p>Découvrez notre collection de meubles design</p>
      <!-- ✅ Barre de recherche -->
      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input v-model="recherche" type="text" placeholder="Rechercher un produit..." />
      </div>
    </div>
  </div>

  <!-- Produits -->
  <section class="shop-section">
    <div class="container">
      <!-- Compteur -->
      <div class="shop-meta" v-if="!loading">
        <p>{{ produitsFiltres.length }} produit(s) trouvé(s)</p>
      </div>

      <!-- Chargement -->
      <div v-if="loading" class="etat-centre">
        <div class="spinner"></div>
        <p>Chargement des produits...</p>
      </div>

      <!-- Erreur -->
      <div v-else-if="erreur" class="alerte-erreur">{{ erreur }}</div>

      <!-- Aucun résultat -->
      <div v-else-if="produitsFiltres.length === 0" class="etat-centre">
        <div style="font-size: 48px">📦</div>
        <h3>Aucun produit trouvé</h3>
        <p>Essayez un autre terme de recherche</p>
      </div>

      <!-- Grille produits -->
      <div v-else class="produits-grid">
        <div
          v-for="produit in produitsFiltres"
          :key="produit.id"
          class="produit-card"
          @click="goToCard(produit)"
        >
          <!-- Badge rupture -->
          <span v-if="produit.quantite <= 0" class="badge-rupture">Rupture de stock</span>

          <!-- Image -->
          <div class="produit-img-wrap">
            <img :src="getImageUrl(produit)" :alt="produit.nom" class="produit-img" />
            <div class="produit-overlay">
              <span v-if="produit.quantite > 0">🛒 Ajouter au panier</span>
              <span v-else>❌ Indisponible</span>
            </div>
          </div>

          <!-- Infos -->
          <div class="produit-infos">
            <h3 class="produit-nom">{{ produit.nom }}</h3>
            <p class="produit-desc">{{ produit.description }}</p>
            <div class="produit-footer">
              <!-- ✅ Prix en FCFA -->
              <strong class="produit-prix">{{ formatPrix(produit.prix) }}</strong>
              <span class="stock-label" :class="produit.quantite > 0 ? 'en-stock' : 'hors-stock'">
                {{ produit.quantite > 0 ? `Stock : ${produit.quantite}` : 'Indisponible' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer inchangé -->
  <footer class="footer-section">
    <div class="container relative">
      <div class="sofa-img">
        <img src="/assets/images/sofa.png" alt="Image" class="img-fluid" />
      </div>
      <div class="row">
        <div class="col-lg-8">
          <div class="subscription-form">
            <h3 class="d-flex align-items-center">
              <span class="me-1">
                <img src="/assets/images/envelope-outline.svg" alt="Image" class="img-fluid" />
              </span>
              <span>Subscribe to Newsletter</span>
            </h3>
            <form action="#" class="row g-3">
              <div class="col-auto">
                <input type="text" class="form-control" placeholder="Enter your name" />
              </div>
              <div class="col-auto">
                <input type="email" class="form-control" placeholder="Enter your email" />
              </div>
              <div class="col-auto">
                <button class="btn btn-primary">
                  <span class="fa fa-paper-plane"></span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="row g-5 mb-5">
        <div class="col-lg-4">
          <div class="mb-4 footer-logo-wrap">
            <a href="#" class="footer-logo">Furni<span>.</span></a>
          </div>
          <p class="mb-4">
            Donec facilisis quam ut purus rutrum lobortis. Donec vitae odio quis nisl dapibus
            malesuada. Nullam ac aliquet velit.
          </p>
          <ul class="list-unstyled custom-social">
            <li>
              <a href="#"><span class="fa fa-brands fa-facebook-f"></span></a>
            </li>
            <li>
              <a href="#"><span class="fa fa-brands fa-twitter"></span></a>
            </li>
            <li>
              <a href="#"><span class="fa fa-brands fa-instagram"></span></a>
            </li>
            <li>
              <a href="#"><span class="fa fa-brands fa-linkedin"></span></a>
            </li>
          </ul>
        </div>
        <div class="col-lg-8">
          <div class="row links-wrap">
            <div class="col-6 col-sm-6 col-md-3">
              <ul class="list-unstyled">
                <li><a href="#">About us</a></li>
                <li><a href="#">Services</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Contact us</a></li>
              </ul>
            </div>
            <div class="col-6 col-sm-6 col-md-3">
              <ul class="list-unstyled">
                <li><a href="#">Support</a></li>
                <li><a href="#">Knowledge base</a></li>
                <li><a href="#">Live chat</a></li>
              </ul>
            </div>
            <div class="col-6 col-sm-6 col-md-3">
              <ul class="list-unstyled">
                <li><a href="#">Jobs</a></li>
                <li><a href="#">Our team</a></li>
                <li><a href="#">Leadership</a></li>
                <li><a href="#">Privacy Policy</a></li>
              </ul>
            </div>
            <div class="col-6 col-sm-6 col-md-3">
              <ul class="list-unstyled">
                <li><a href="#">Nordic Chair</a></li>
                <li><a href="#">Kruzo Aero</a></li>
                <li><a href="#">Ergonomic Chair</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="border-top copyright">
        <div class="row pt-4">
          <div class="col-lg-6">
            <p class="mb-2 text-center text-lg-start">
              Copyright &copy; {{ new Date().getFullYear() }}
            </p>
          </div>
          <div class="col-lg-6 text-center text-lg-end">
            <ul class="list-unstyled d-inline-flex ms-auto">
              <li class="me-4"><a href="#">Terms &amp; Conditions</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* ── Hero ── */
.shop-hero {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%);
  padding: 64px 0 48px;
  text-align: center;
  color: white;
}
.shop-hero h1 {
  font-size: 40px;
  font-weight: 800;
  margin-bottom: 10px;
}
.shop-hero p {
  font-size: 16px;
  color: #94a3b8;
  margin-bottom: 28px;
}

/* ── Barre de recherche ── */
.search-bar {
  display: inline-flex;
  align-items: center;
  background: white;
  border-radius: 50px;
  padding: 10px 20px;
  width: 100%;
  max-width: 420px;
  gap: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}
.search-bar input {
  border: none;
  outline: none;
  font-size: 15px;
  width: 100%;
  color: #1a1a2e;
}
.search-icon {
  font-size: 16px;
}

/* ── Section produits ── */
.shop-section {
  background: #f4f6f9;
  padding: 48px 0 80px;
}

.shop-meta {
  margin-bottom: 24px;
  color: #6b7280;
  font-size: 14px;
}

/* ── Spinner ── */
.etat-centre {
  text-align: center;
  padding: 80px 20px;
  color: #6b7280;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top-color: #42b983;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── Alerte erreur ── */
.alerte-erreur {
  background: #fee2e2;
  color: #b91c1c;
  border-left: 4px solid #ef4444;
  padding: 14px 18px;
  border-radius: 8px;
}

/* ── Grille ── */
.produits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
}

/* ── Carte produit ── */
.produit-card {
  background: white;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  position: relative;
}
.produit-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.13);
}

/* ── Badge rupture ── */
.badge-rupture {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #ef4444;
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  z-index: 2;
}

/* ── Image ── */
.produit-img-wrap {
  position: relative;
  overflow: hidden;
  height: 200px;
  background: #f8fafc;
}
.produit-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}
.produit-card:hover .produit-img {
  transform: scale(1.05);
}

.produit-overlay {
  position: absolute;
  inset: 0;
  background: rgba(66, 185, 131, 0.85);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 15px;
  opacity: 0;
  transition: opacity 0.2s;
}
.produit-card:hover .produit-overlay {
  opacity: 1;
}

/* ── Infos ── */
.produit-infos {
  padding: 16px;
}
.produit-nom {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 6px;
}
.produit-desc {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.produit-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.produit-prix {
  font-size: 17px;
  font-weight: 800;
  color: #42b983;
}
.stock-label {
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
}
.en-stock {
  background: #d1fae5;
  color: #065f46;
}
.hors-stock {
  background: #fee2e2;
  color: #991b1b;
}

/* ── Responsive ── */
@media (max-width: 640px) {
  .shop-hero h1 {
    font-size: 28px;
  }
  .produits-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
}
</style>
