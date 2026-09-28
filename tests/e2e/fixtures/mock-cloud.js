// Sustituto de js/cloud.js para los tests e2e: evita depender de
// Firebase de verdad. Su comportamiento se configura desde cada test
// escribiendo `window.__mockCloudConfig` con page.addInitScript()
// ANTES de navegar, por ejemplo:
//   { loggedIn: true, syncOnLaunchResult: true }
function cfg() {
  return (typeof window !== "undefined" && window.__mockCloudConfig) || {};
}

let mockUser = null;
function getUser() {
  if (!cfg().loggedIn) return null;
  if (!mockUser) {
    mockUser = { uid: "mock-uid", email: "sebastian@example.com", displayName: cfg().displayName || "Sebastian" };
  }
  return mockUser;
}

function currentUser() {
  return getUser();
}
function getIdToken() {
  return Promise.resolve(null);
}
function onAuthChange(cb) {
  const delay = cfg().authDelayMs || 0;
  setTimeout(() => cb(getUser()), delay);
}
async function signUp() {
  return { user: getUser(), error: null };
}
async function signIn() {
  return { user: getUser(), error: null };
}
async function signInSecure() {
  return { user: getUser(), error: null };
}
async function resetPassword() {
  return { ok: true, error: null };
}
async function signInWithGoogle() {
  return { user: getUser(), error: null, cancelled: false, redirecting: false };
}
async function completeGoogleRedirect() {
  return null;
}
async function signOutUser() {
  mockUser = null;
}
async function pushToCloud() {
  return { ok: true };
}
async function pullFromCloud() {
  return { ok: false, empty: true };
}
async function cloudHasBackup() {
  return false;
}
async function saveBirthDate() {}
async function getBirthDate() {
  return null;
}
function enableAutoSync() {}
async function syncOnLaunch() {
  window.__syncOnLaunchCalls = (window.__syncOnLaunchCalls || 0) + 1;
  const delay = cfg().syncDelayMs || 0;
  if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
  return !!cfg().syncOnLaunchResult;
}
async function shareTrip() {
  return { ok: true, code: "ABC123" };
}
async function joinSharedTrip() {
  return { ok: false };
}
async function refreshSharedTrip() {
  return { ok: false };
}
async function refreshAllSharedTrips() {
  return false;
}

export {
  currentUser,
  getIdToken,
  onAuthChange,
  signUp,
  signIn,
  signInSecure,
  resetPassword,
  signInWithGoogle,
  completeGoogleRedirect,
  signOutUser,
  pushToCloud,
  pullFromCloud,
  cloudHasBackup,
  saveBirthDate,
  getBirthDate,
  enableAutoSync,
  syncOnLaunch,
  shareTrip,
  joinSharedTrip,
  refreshSharedTrip,
  refreshAllSharedTrips,
};
