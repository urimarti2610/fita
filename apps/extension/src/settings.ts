import { DEFAULT_OPTIONS, DEFAULT_STYLE, type EmphasisStyle } from "@fita/core";

export type Settings = {
  strength: number;
  style: EmphasisStyle;
  every: number;
  /** Line height applied to text blocks; 0 leaves the page's own. */
  lineHeight: number;
  /** Maximum line length in `ch`; 0 leaves the page's own. */
  maxWidth: number;
};

export const DEFAULT_SETTINGS: Settings = {
  strength: DEFAULT_OPTIONS.strength,
  style: DEFAULT_STYLE,
  every: DEFAULT_OPTIONS.every,
  lineHeight: 0,
  maxWidth: 0,
};

/** Per-site entry, stored under its own key so the sync quota per item is never hit. */
export type SiteEntry = { on?: boolean | undefined; settings?: Partial<Settings> | undefined };

export const SETTINGS_KEY = "settings";
export const ALL_SITES_KEY = "allSites";
const SITE_PREFIX = "site:";
export const siteKey = (origin: string) => `${SITE_PREFIX}${origin}`;

/** Origin usable for per-site settings, or null for pages where sites make no sense. */
export function siteOrigin(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const { protocol, origin } = new URL(url);
    return protocol === "http:" || protocol === "https:" ? origin : null;
  } catch {
    return null;
  }
}

/** Host permission / match pattern for an origin. Match patterns cannot carry a port. */
export function originPattern(origin: string): string {
  const { protocol, hostname } = new URL(origin);
  return `${protocol}//${hostname}/*`;
}
export const ALL_SITES_PATTERN = "*://*/*";

export type SiteState = {
  settings: Settings;
  /** True when this site has its own settings. */
  custom: boolean;
  alwaysOn: boolean;
  allSites: boolean;
};

export async function loadSiteState(origin: string | null): Promise<SiteState> {
  const keys = [SETTINGS_KEY, ALL_SITES_KEY, ...(origin ? [siteKey(origin)] : [])];
  const data = await chrome.storage.sync.get(keys);
  const site = (origin ? data[siteKey(origin)] : undefined) as SiteEntry | undefined;
  return {
    settings: {
      ...DEFAULT_SETTINGS,
      ...(data[SETTINGS_KEY] as Partial<Settings> | undefined),
      ...site?.settings,
    },
    custom: site?.settings !== undefined,
    alwaysOn: site?.on === true,
    allSites: data[ALL_SITES_KEY] === true,
  };
}

export async function updateSite(origin: string, change: Partial<SiteEntry>) {
  const key = siteKey(origin);
  const current = ((await chrome.storage.sync.get(key))[key] ?? {}) as SiteEntry;
  const next: SiteEntry = { ...current, ...change };
  for (const k of Object.keys(next) as (keyof SiteEntry)[]) {
    if (next[k] === undefined || next[k] === false) delete next[k];
  }
  if (Object.keys(next).length === 0) await chrome.storage.sync.remove(key);
  else await chrome.storage.sync.set({ [key]: next });
}

/** Saves settings for the site (when it has its own) or globally. */
export async function saveSettings(origin: string | null, custom: boolean, settings: Settings) {
  if (origin && custom) await updateSite(origin, { settings });
  else await chrome.storage.sync.set({ [SETTINGS_KEY]: settings });
}

/** Origins with "always on", from the whole sync store. */
export async function alwaysOnOrigins(): Promise<string[]> {
  const all = await chrome.storage.sync.get(null);
  return Object.entries(all)
    .filter(([key, value]) => key.startsWith(SITE_PREFIX) && (value as SiteEntry).on)
    .map(([key]) => key.slice(SITE_PREFIX.length));
}

/** Messages between popup/background and the content script. */
export type ContentMessage =
  | { type: "get" }
  | { type: "set"; enabled?: boolean }
  | { type: "preview"; settings: Settings };
export type ContentReply = { enabled: boolean };
/** Sent by the content script so the background can update the badge. */
export type StateMessage = { type: "state"; enabled: boolean };

/** A permission request started by the popup, finished by whoever survives the prompt. */
export type PendingGrant = { kind: "site"; origin: string } | { kind: "all" };
const PENDING_KEY = "pendingGrant";

export async function requestGrant(grant: PendingGrant): Promise<boolean> {
  await chrome.storage.local.set({ [PENDING_KEY]: grant });
  const pattern = grant.kind === "all" ? ALL_SITES_PATTERN : originPattern(grant.origin);
  const granted = await chrome.permissions.request({ origins: [pattern] }).catch(() => false);
  if (granted) await applyPendingGrant();
  else await chrome.storage.local.remove(PENDING_KEY);
  return granted;
}

export async function applyPendingGrant() {
  const grant = (await chrome.storage.local.get(PENDING_KEY))[PENDING_KEY] as
    | PendingGrant
    | undefined;
  if (!grant) return;
  await chrome.storage.local.remove(PENDING_KEY);
  const pattern = grant.kind === "all" ? ALL_SITES_PATTERN : originPattern(grant.origin);
  if (!(await chrome.permissions.contains({ origins: [pattern] }))) return;
  if (grant.kind === "all") await chrome.storage.sync.set({ [ALL_SITES_KEY]: true });
  else await updateSite(grant.origin, { on: true });
}
