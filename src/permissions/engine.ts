export type Permission = {
  id: number;
  name: string;
  title?: string;
};

export type ComparedPermission = Permission & {
  has: boolean;
};

export type PermissionEngine = {
  fullPermissions: ReadonlyArray<Permission>;
  userPermissions: ReadonlyArray<Permission>;
  userNames: ReadonlySet<string>;
  comparison: ReadonlyArray<ComparedPermission>;
  grouped: Readonly<Record<string, ReadonlyArray<ComparedPermission>>>;
  missingFromUser: ReadonlyArray<Permission>;
  unknownFromBackend: ReadonlyArray<Permission>;
  has: (permissionName: string) => boolean;
  hasAny: (permissionNames: ReadonlyArray<string>) => boolean;
  hasAll: (permissionNames: ReadonlyArray<string>) => boolean;
};

export type GroupedPermissions = Readonly<Record<string, ReadonlyArray<ComparedPermission>>>;

export type OrderedGroup = {
  key: string;
  items: ReadonlyArray<ComparedPermission>;
};

export const DEFAULT_GROUP_ORDER = ['BUYER', 'SELLER', 'PAYMENT', 'PAYMENT_HISTORY', 'COMPANY', 'USER', 'RETURN_PRODUCT', 'OTHER'] as const;

/**
 * Convert grouped object to a stable ordered array.
 * - You control ordering via `order`
 * - Any remaining groups not in `order` are appended at the end (keeps nothing "lost")
 */
export function orderGrouped(
  grouped: GroupedPermissions,
  order: ReadonlyArray<string> = DEFAULT_GROUP_ORDER,
  options?: {includeEmpty?: boolean},
): ReadonlyArray<OrderedGroup> {
  const includeEmpty = options?.includeEmpty ?? true;
  const seen = new Set<string>();
  const out: OrderedGroup[] = [];

  for (const key of order) {
    const items = grouped[key] ?? [];
    if (includeEmpty || items.length) {
      out.push({key, items});
    }
    seen.add(key);
  }

  for (const key of Object.keys(grouped)) {
    if (seen.has(key)) {
      continue;
    }
    const items = grouped[key] ?? [];
    if (includeEmpty || items.length) {
      out.push({key, items});
    }
  }
  return out;
}

function normalizeName(name: string): string {
  return String(name ?? '').trim().toUpperCase();
}

function inferGroupName(name: string): string {
  const n = normalizeName(name);
  if (!n) {
    return 'OTHER';
  }

  // Prefer prefix grouping like BUYER_CREATE -> BUYER
  const prefix = n.split(/[:._-]/)[0];
  if (prefix) {
    return prefix;
  }

  // Fallback keyword grouping
  if (n.includes('BUYER')) {
    return 'BUYER';
  }
  if (n.includes('SELLER')) {
    return 'SELLER';
  }
  if (n.includes('PAYMENT')) {
    return 'PAYMENT';
  }
  if (n.includes('PAYMENT_HISTORY')) {
    return 'PAYMENT_HISTORY';
  }
  if (n.includes('USER')) {
    return 'USER';
  }
  if (n.includes('RETURN_PRODUCT')) {
    return 'RETURN_PRODUCT';
  }
  return 'OTHER';
}

/**
 * Pure function (no hooks): builds a fast permission engine.
 * Optimized for large lists (200+) using Sets/Maps. O(n + m)
 */
export function buildPermissionEngine(args: {
  fullPermissions: ReadonlyArray<Permission>;
  userPermissions: ReadonlyArray<Permission>;
}): PermissionEngine {
  const {fullPermissions, userPermissions} = args;

  const fullNames = new Set(fullPermissions.map(p => normalizeName(p.name)));
  const userNames = new Set(userPermissions.map(p => normalizeName(p.name)));

  const comparison: ComparedPermission[] = fullPermissions.map(p => ({
    ...p,
    has: userNames.has(normalizeName(p.name)),
  }));

  // grouped: keep COMPANY, and also split BUYER/SELLER even if they are under COMPANY
  const grouped: Record<string, ComparedPermission[]> = {
    COMPANY: [],
    BUYER: [],
    SELLER: [],
    USER: [],
    RETURN_PRODUCT: [],
    OTHER: [],
  };

  const seenByGroup: Record<string, Set<string>> = {};
  const pushUnique = (groupName: string, p: ComparedPermission) => {
    const key = `${p.id}:${normalizeName(p.name)}`;
    const seen = (seenByGroup[groupName] ||= new Set<string>());
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    (grouped[groupName] ||= []).push(p);
  };

  for (const p of comparison) {
    const n = normalizeName(p.name);

    // default grouping (prefix-based)
    pushUnique(inferGroupName(p.name), p);

    // extra buckets (so COMPANY stays, but BUYER/SELLER become separate too)
    if (n.includes('COMPANY')) {
      pushUnique('COMPANY', p);
    }
    if (n.includes('BUYER')) {
      pushUnique('BUYER', p);
    }
    if (n.includes('SELLER')) {
      pushUnique('SELLER', p);
    }
    if (n.includes('PAYMENT')) {
      pushUnique('PAYMENT', p);
    }
    if (n.includes('PAYMENT_HISTORY')) {
      pushUnique('PAYMENT_HISTORY', p);
    }
    if (n.includes('USER')) {
      pushUnique('USER', p);
    }
    if (n.includes('RETURN_PRODUCT')) {
      pushUnique('RETURN_PRODUCT', p);
    }
  }

  const missingFromUser = comparison.filter(p => !p.has);
  const unknownFromBackend = userPermissions.filter(p => !fullNames.has(normalizeName(p.name)));

  const has = (permissionName: string) => userNames.has(normalizeName(permissionName));
  const hasAny = (permissionNames: ReadonlyArray<string>) => {
    for (const n of permissionNames) {
      if (has(n)) {
        return true;
      }
    }
    return false;
  };
  const hasAll = (permissionNames: ReadonlyArray<string>) => {
    for (const n of permissionNames) {
      if (!has(n)) {
        return false;
      }
    }
    return true;
  };

  return {
    fullPermissions,
    userPermissions,
    userNames,
    comparison,
    grouped,
    missingFromUser,
    unknownFromBackend,
    has,
    hasAny,
    hasAll,
  };
}

/**
 * Backward-compatible helper: compare + group
 */
export function comparePermissions(args: {
  fullPermissions: ReadonlyArray<Permission>;
  userPermissions: ReadonlyArray<Permission>;
}) {
  const engine = buildPermissionEngine(args);
  orderGrouped(engine.grouped);
  return {comparison: engine.comparison, grouped: engine.grouped};
}


