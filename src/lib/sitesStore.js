const KEY = "oem_sites_v1";

export function getSites() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveSites(sites) {
  localStorage.setItem(KEY, JSON.stringify(sites));
}

export function addSite(site) {
  const sites = getSites();
  sites.unshift(site);
  saveSites(sites);
  return sites;
}
