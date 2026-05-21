import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ProfileHeader from "../components/ProfileHeader";
import Sidebar from "../components/Sidebar";

export default function Reports() {
  const navigate = useNavigate();

  
useEffect(() => {
  if (!localStorage.getItem("token")) {
    navigate("/");
  }

  fetchStats(); // ✅ only this

}, []);

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // SAMPLE REPORTS
  const reports = [
    {
      name: "Faculty List",
      description: "List of all faculty members",
      department: "All departments",
    },
    {
      name: "Department Summary",
      description: "Summary of all departments",
      department: "All departments",
    },
    {
      name: "Teaching Assignment",
      description: "Faculty teaching assignments",
      department: "All departments",
    },
    {
      name: "Qualification Report",
      description: "Faculty qualifications summary",
      department: "All departments",
    },
    {
      name: "Employment Report",
      description: "Employment details of faculty",
      department: "All departments",
    },
  ];

  const [stats, setStats] = useState({
  departments: 0,
  faculty: 0,
  newFaculty: 0,
  programs: 45, // fixed
});

  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
  try {
    const [facultyRes, deptRes] = await Promise.all([
      fetch("http://127.0.0.1:8000/api/faculty"),
      fetch("http://127.0.0.1:8000/api/departments"),
    ]);

    const facultyData = await facultyRes.json();
    const deptData = await deptRes.json();

    const now = new Date();

    const newFaculty = facultyData.filter((f) => {
      if (!f.created_at) return false;

      const created = new Date(f.created_at);
      const diff = (now - created) / (1000 * 60 * 60 * 24);

      return diff <= 1;
    }).length;

    setStats({
      departments: deptData.length,
      faculty: facultyData.length,
      newFaculty,
      programs: 45,
    });

    setLoading(false); // 👈 DITO

  } catch (err) {
    console.error(err);
    setLoading(false); // 👈 para kahit error mawala loading
  }
};


  return (
    <div className="h-screen w-screen flex overflow-hidden">

      {/* SIDEBAR */}
      <div className="w-64 bg-gradient-to-b from-blue-800 to-blue-600 text-white flex flex-col p-5">

        {/* LOGO */}
        <div className="flex items-center gap-3 mb-10">
          <img src="/images/logo.png" className="w-10 h-10" />
          <div>
            <p className="font-semibold text-sm">OMSC</p>
            <p className="text-xs text-white/70">
              Faculty Profiling System
            </p>
          </div>
        </div>

        {/* NAV */}
        <Sidebar />

        <button
          onClick={logout}
          className="mt-auto bg-red-500 hover:bg-red-400 p-2 rounded"
        >
          Log out
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">

        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Reports</h1>

         <ProfileHeader />
        </div>

        {/* FILTERS */}
        <div className="flex gap-4 mb-6 justify-between">
          

          <select className="flex-1 p-2 border rounded w-1/4">
                  <option value="">Department</option>
      <option>BSIT</option>
      <option>BEED</option>
      <option>BSBA-OM</option>
      <option>BSBA-FM</option>
          </select>

          <input
            type="text"
            placeholder="May 1, 2024 - May 31, 2024"
            className="p-2 border rounded w-1/4"
          />

          <button className="bg-blue-600 text-white px-4 rounded">
            Filter
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-4 mb-6">

<div className="bg-white p-4 rounded-xl shadow">
  <p className="text-sm text-gray-500">TOTAL DEPARTMENTS</p>
  {loading ? (
    <p className="text-gray-400 text-sm">Loading...</p>
  ) : (
    <h2 className="text-xl font-bold">{stats.departments}</h2>
  )}
</div>

<div className="bg-white p-4 rounded-xl shadow">
  <p className="text-sm text-gray-500">TOTAL FACULTY</p>

  {loading ? (
    <p className="text-gray-400 text-sm">Loading...</p>
  ) : (
    <h2 className="text-xl font-bold">{stats.faculty}</h2>
  )}

</div>

<div className="bg-white p-4 rounded-xl shadow">
  <p className="text-sm text-gray-500">NEW FACULTY</p>
  {loading ? (
    <p className="text-gray-400 text-sm">Loading...</p>
  ) : (
    <h2 className="text-xl font-bold">{stats.newFaculty}</h2>
  )}
</div>

<div className="bg-white p-4 rounded-xl shadow">
  <p className="text-sm text-gray-500">TOTAL PROGRAMS</p>
  {loading ? (
    <p className="text-gray-400 text-sm">Loading...</p>
  ) : (
    <h2 className="text-xl font-bold">{stats.programs}</h2>
  )}
</div>

</div>

        {/* REPORT TABLE */}
        <div className="bg-white rounded-xl shadow p-4">

          <div className="flex justify-between mb-4">
            <h2 className="font-semibold text-lg">Report Summary</h2>

            <button className="bg-blue-600 text-white px-4 py-1 rounded">
              Export
            </button>
          </div>

          {/* HEADER */}
          <div className="grid grid-cols-4 font-semibold text-sm border-b pb-2">
            <div>Report Summary</div>
            <div>Description</div>
            <div>Department</div>
            <div>Actions</div>
          </div>

          {/* ROWS */}
          {reports.map((r, i) => (
            <div
              key={i}
              className="grid grid-cols-4 text-sm py-3 border-b items-center"
            >
              <div>{r.name}</div>
              <div>{r.description}</div>
              <div>{r.department}</div>

              <div>
                <button className="text-blue-600 text-lg">
                  ⬇️
                </button>
              </div>
            </div>
          ))}

          <p className="text-sm text-gray-500 mt-3">
            Showing {reports.length} reports
          </p>

        </div>

      </div>
    </div>
  );
}