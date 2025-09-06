import { isAdmin } from "../lib/admin";

export default function AdminOnly({ children }) {
  return isAdmin() ? children : null;
}
