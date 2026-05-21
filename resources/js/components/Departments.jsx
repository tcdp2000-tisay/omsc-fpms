import { useEffect, useState } from "react"; // ✅ FIXED
import { useNavigate, Link } from "react-router-dom";
import ProfileHeader from "../components/ProfileHeader";
import Sidebar from "../components/Sidebar";

export default function Departments() {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
const [errors, setErrors] = useState({});

  const handleEdit = (dept) => {
  setForm({
    name: dept.name,
    programs: dept.programs,
    head: dept.head,
  });

  setEditId(dept.id);     // 👈 important
  setShowModal(true);     // open modal
};


  const [form, setForm] = useState({
    name: "",
    programs: "",
    head: "",
  });

  const user = JSON.parse(localStorage.getItem("user")); // ✅ FIXED

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }

    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/departments");
      const data = await res.json();
      setDepartments(data);
    } catch (error) {
      console.error(error); // ✅ FIXED
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

    let newErrors = {};

  // ✅ validation
  if (!form.name) newErrors.name = "Required";
  if (!form.programs) newErrors.programs = "Required";
  if (!form.head) newErrors.head = "Required";

  // 👇 if may error, stop submit
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setErrors({}); // clear errors

  // 👇 check duplicate sa frontend
  const exists = departments.some(
    (d) =>
      d.name.toLowerCase() === form.name.toLowerCase() &&
      d.id !== editId
  );

  if (exists) {
    alert("Department already exists!");
    return;
  }

  try {
    let url = "http://127.0.0.1:8000/api/departments";
    let method = "POST";

    if (editId) {
      url = `http://127.0.0.1:8000/api/departments/${editId}`;
      method = "PUT";
    }

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    fetchDepartments();
    setShowModal(false);
    setEditId(null);

    setForm({
      name: "",
      programs: "",
      head: "",
    });

  } catch (error) {
    console.error(error);
  }
};

  const deleteDepartment = async (id) => {
    await fetch(`http://127.0.0.1:8000/api/departments/${id}`, {
      method: "DELETE",
    });

    fetchDepartments();
  };

const filteredDepartments = departments.filter((d) =>
  `${d.name} ${d.head} ${d.programs}`
    .toLowerCase()
    .includes(search.toLowerCase())
);

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

        <button onClick={logout} className="mt-auto bg-red-500 hover:bg-red-400 p-2 rounded">
          Log out
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">

        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Departments</h1>

         <ProfileHeader />
        </div>

        {/* SEARCH + ADD */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <input type="text" placeholder="Search Departments..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 p-2 rounded border"/>
          <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
            + Add Department
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          
          <div className="grid grid-cols-6 bg-gray-100 p-3 text-sm font-semibold">
            <div>Department</div>
            <div>Faculty Count</div>
            <div>Programs</div>
            <div>Head</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          {filteredDepartments.map((d, i) => (
            <div key={i} className="grid grid-cols-6 p-3 items-center border-t text-sm">
              <div className="font-semibold">{d.name}</div>
             <div>{d.faculties_count}</div>
              <div>{d.programs}</div>
              <div>{d.head}</div>

              <div>
                <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">
                  Active
                </span>
              </div>

              <div className="flex gap-2">
                <button onClick={() => handleEdit(d)} className="text-blue-600">✏️</button>
                <button onClick={() => deleteDepartment(d.id)} className="text-red-500">
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-500 mt-3">
          Showing {departments.length} Departments
        </p>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[500px]">

            <h2 className="mb-4 font-bold">{editId ? "Edit Department" : "Add Department"}</h2>

            <form onSubmit={handleSubmit} className="grid gap-3">
              <select
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`border p-2 ${errors.name ? "border-red-500" : ""}`}
                >
                <option value="">Select Department</option>
                <option value="BSIT">BSIT</option>
                <option value="BEED">BEED</option>
                <option value="BSBA-OM">BSBA-OM</option>
                <option value="BSBA-FM">BSBA-FM</option>
                </select>
                {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}

              
              <input name="programs" value={form.programs} onChange={handleChange} placeholder="Programs" className={`border p-2 ${errors.name ? "border-red-500" : ""}`} />
             {errors.programs && <p className="text-red-500 text-xs">{errors.programs}</p>}

              <input name="head" value={form.head} onChange={handleChange} placeholder="Department Head" className={`border p-2 ${errors.name ? "border-red-500" : ""}`} />
{errors.head && <p className="text-red-500 text-xs">{errors.head}</p>}

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="border px-3 py-1">
                  Cancel
                </button>
                <button className="bg-blue-600 text-white px-3 py-1">
                  Save
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}