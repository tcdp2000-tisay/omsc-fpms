import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import ProfileHeader from "../components/ProfileHeader";

export default function Dashboard() {

  const [recentFaculty, setRecentFaculty] = useState([]);
  const fetchRecentFaculty = async () => {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/faculty");
    const data = await res.json();

    const latest = data.slice(-5).reverse();

    setRecentFaculty(latest);

  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  if (!localStorage.getItem("token")) {
    navigate("/");
  }

  fetchCounts();
  fetchRecentFaculty();
}, []);

  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    total: 0,
    BSIT: 0,
    BEED: 0,
    "BSBA-OM": 0,
    "BSBA-FM": 0,
  });
 

    const user = JSON.parse(localStorage.getItem("user"));

    const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    };


    const fetchCounts = async () => {
      setLoading(true);
  try {
    const res = await fetch("http://127.0.0.1:8000/api/faculty");
    const data = await res.json();

    let newCounts = {
      total: data.length,
      BSIT: 0,
      BEED: 0,
      "BSBA-OM": 0,
      "BSBA-FM": 0,
    };

    data.forEach((f) => {
      if (newCounts[f.department] !== undefined) {
        newCounts[f.department]++;
      }
    });

    setCounts(newCounts);
 
    setLoading(false); // 👈 ADD THIS
  } catch (error) {
    console.error(error);
     setLoading(false); // 👈 ADD THIS
  }
};

const COLORS = ["#7C3AED", "#2563EB", "#DC2626", "#F59E0B"];

const chartData = [
  { name: "BSIT", value: counts.BSIT },
  { name: "BEED", value: counts.BEED },
  { name: "BSBA-OM", value: counts["BSBA-OM"] },
  { name: "BSBA-FM", value: counts["BSBA-FM"] },
];
const renderLabel = ({ percent }) => {
  return `${(percent * 100).toFixed(1)}%`;
};

  const [loading, setLoading] = useState(true);

 

// const goToProfile = () => {
//   navigate("/profile"); // 👉 dito pupunta
// };

  return (
    <div className="h-screen w-screen flex overflow-hidden">

      {/* SIDEBAR */}
      <div className="w-64 bg-gradient-to-b from-blue-800 to-blue-600 text-white flex flex-col p-5">
       <div className="flex items-center gap-3 mb-10">
        <img src="/images/logo.png" className="w-10 h-10" />

        <div className="leading-tight">
          <p className="font-semibold text-sm">OMSC</p>
          <p className="text-xs text-white/70">
            Faculty Profiling System
          </p>
        </div>
      </div>

        <Sidebar />

        <button
          onClick={logout}
          className="mt-auto bg-red-500 hover:bg-red-400 p-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">

        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>

          {/* PROFILE */}
        <ProfileHeader />
        </div>

<div className="grid grid-cols-5 gap-2 mb-6">

  <div className="bg-white p-4 rounded-xl shadow">
    <p className="text-gray-500">Total Faculty</p>
   <h2 className="text-xl font-bold">
  {loading ? (
    <span className="animate-pulse text-gray-400">Loading...</span>
  ) : (
    counts.total
  )}
</h2>
  </div>

  <div className="bg-white p-4 rounded-xl shadow">
    <p className="text-gray-500">BSIT</p>
   <h2 className="text-xl font-bold">
  {loading ? (
    <span className="animate-pulse text-gray-400">Loading...</span>
  ) : (
    counts.BSIT
  )}
</h2>
  </div>

  <div className="bg-white p-4 rounded-xl shadow">
    <p className="text-gray-500">BEED</p>
   <h2 className="text-xl font-bold">
  {loading ? (
    <span className="animate-pulse text-gray-400">Loading...</span>
  ) : (
    counts.BEED
  )}
</h2>
  </div>

  <div className="bg-white p-4 rounded-xl shadow">
    <p className="text-gray-500">BSBA OM</p>
   <h2 className="text-xl font-bold">
  {loading ? (
    <span className="animate-pulse text-gray-400">Loading...</span>
  ) : (
    counts["BSBA-OM"]
  )}
</h2>
  </div>

  <div className="bg-white p-4 rounded-xl shadow">
    <p className="text-gray-500">BSBA FM</p>
    <h2 className="text-xl font-bold">
  {loading ? (
    <span className="animate-pulse text-gray-400">Loading...</span>
  ) : (
    counts["BSBA-FM"]
  )}
</h2>
  </div>

</div>

        {/* CONTENT */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">
            Faculty by Department
          </h2>

          <div className="w-full h-[300px]">
            <ResponsiveContainer>
              <PieChart>

                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="40%"   // 👈 move left para may space legend
                  cy="50%"
                  outerRadius={100}
                  label={renderLabel}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>

                <Tooltip />

                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                />

              </PieChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-gray-400 mt-2">
            Based on active faculty
          </p>
        </div>

           <div className="bg-white p-6 rounded-xl shadow">
  
  {/* HEADER */}
  <div className="flex justify-between items-center mb-4">
    <h2 className="font-semibold">Recent Faculty</h2>

    <Link
      to="/faculty"
      className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full"
    >
      View All
    </Link>
  </div>

  {/* LIST */}
  <div className="space-y-3">
    {recentFaculty.map((f, index) => (
      <div
        key={index}
        className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
      >
        {/* LEFT */}
        <div className="flex items-center gap-3">
          
          {/* AVATAR */}
          <div className="w-10 h-10 bg-gray-300 rounded flex items-center justify-center text-white">
            👤
          </div>

          {/* INFO */}
          <div className="text-sm leading-tight">
            <p className="font-medium">{f.name}</p>
            <p className="text-gray-400 text-xs">
              {f.department}
            </p>
          </div>

        </div>

        {/* STATUS */}
        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
          Active
        </span>
      </div>
    ))}
  </div>

</div>
        </div>

      </div>
    </div>
  );
}