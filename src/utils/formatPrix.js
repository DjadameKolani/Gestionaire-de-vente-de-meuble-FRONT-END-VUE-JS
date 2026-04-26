export function formatPrix(prix) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(prix)
  // Résultat : "15 000 F CFA"
}
