// Simulated admin authentication
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "pradesha123";

export function login(username: string, password: string): boolean {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    localStorage.setItem("isAdmin", "true");
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem("isAdmin");
}

export function isAdmin(): boolean {
  return localStorage.getItem("isAdmin") === "true";
}
