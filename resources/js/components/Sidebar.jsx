import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const linkClass = (path) =>
    `p-2 rounded ${
      location.pathname === path
        ? "bg-white/20"
        : "hover:bg-white/20"
    }`;

  return (
    <nav className="flex flex-col gap-3">

      {/* ✅ LAGING MERON */}
      <Link to="/dashboard" className={linkClass("/dashboard")}>
        Dashboard
      </Link>

      {/* ✅ ADMIN LANG */}
      {currentUser.role === "admin" && (
        <>
          <Link to="/faculty" className={linkClass("/faculty")}>
            Faculty
          </Link>

          <Link to="/departments" className={linkClass("/departments")}>
            Departments
          </Link>

          <Link to="/reports" className={linkClass("/reports")}>
            Reports
          </Link>

          <Link to="/settings" className={linkClass("/settings")}>
            Settings
          </Link>
        </>
      )}

    </nav>
  );
}