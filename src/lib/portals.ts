export interface PortalModule {
  id: string;
  href: string;
  label: string;
  icon: string;
  color: string;
  allowedRoles: string[];
}

// Adaugă portale noi aici — apar automat în PortalTopBar pentru rolurile specificate
export const PORTAL_MODULES: PortalModule[] = [
  {
    id: 'federatie',
    href: '/federatie-admin',
    label: 'Federație',
    icon: '🏛️',
    color: '#F4B400',
    allowedRoles: ['FEDERATION_ADMIN', 'SUPERADMIN'],
  },
  {
    id: 'asociatie',
    href: '/asociatie-admin',
    label: 'Asociație',
    icon: '🗺️',
    color: '#f97316',
    allowedRoles: ['ASSOCIATION_ADMIN', 'FEDERATION_ADMIN', 'SUPERADMIN'],
  },
  {
    id: 'club',
    href: '/admin',
    label: 'Club',
    icon: '🏟️',
    color: '#3b82f6',
    allowedRoles: ['ADMIN', 'COACH', 'SUPERADMIN', 'FEDERATION_ADMIN'],
  },
];

export function getVisiblePortals(role: string): PortalModule[] {
  return PORTAL_MODULES.filter(p => p.allowedRoles.includes(role));
}

export function getCurrentPortalId(pathname: string): string {
  if (pathname.startsWith('/federatie-admin')) return 'federatie';
  if (pathname.startsWith('/asociatie-admin')) return 'asociatie';
  if (pathname.startsWith('/admin')) return 'club';
  return '';
}
