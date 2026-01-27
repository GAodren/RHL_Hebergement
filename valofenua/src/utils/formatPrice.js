// Format complet : 116 500 000 XPF
export function formatPriceXPF(price) {
  if (!price) return '—';
  // Utiliser un espace normal au lieu de l'espace insécable (pour compatibilité PDF)
  const formatted = new Intl.NumberFormat('fr-FR').format(price).replace(/\u00A0/g, ' ').replace(/\u202F/g, ' ');
  return formatted + ' XPF';
}

// Format millions : 116,5 MF
export function formatPriceMF(price) {
  if (!price) return '—';
  const millions = price / 1000000;
  if (millions >= 1) {
    return millions.toFixed(1).replace('.', ',') + ' MF';
  }
  // Utiliser un espace normal au lieu de l'espace insécable (pour compatibilité PDF)
  const formatted = new Intl.NumberFormat('fr-FR').format(price).replace(/\u00A0/g, ' ').replace(/\u202F/g, ' ');
  return formatted + ' XPF';
}
