export function categoryImageFor(category?: string | null): string {
  const normalized = (category ?? '').trim();
  if (!normalized) return '/logo.png';

  switch (normalized) {
    case 'Szociális és humanitárius szervezetek':
      return '/charity.png';
    case 'Egészségügyi szervezetek':
      return '/health.png';
    case 'Oktatási és tudományos szervezetek':
      return '/education.png';
    case 'Környezetvédelmi szervezetek':
      return '/nature.png';
    case 'Emberi jogi és jogvédő szervezetek':
      return '/justice.png';
    case 'Kulturális és művészeti szervezetek':
      return '/cultural.png';
    case 'Sport és szabadidős szervezetek':
      return '/running.png';
    case 'Ifjúsági és közösségfejlesztő szervezetek':
      return '/community.png';
    case 'Érdekvédelmi és szakmai szervezetek':
      return '/advocacy.png';
    default:
      return '/logo.png';
  }
}
