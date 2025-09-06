// frontend/src/lib/admin.js
export function isAdmin() {
  return localStorage.getItem("admin") === "true";
}

export function setAdmin(flag) {
  localStorage.setItem("admin", flag ? "true" : "false");
}
