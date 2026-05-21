import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ProfileHeader from "../components/ProfileHeader";
import Sidebar from "../components/Sidebar";

export default function Faculty() {
  const navigate = useNavigate();

  // ✅ STATE
  const [facultyList, setFacultyList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
      user_id: "",
      name: "",
      department: "",
      employeeId: "",
      position: "",
      email: "",
      phone: "",
      status: "Active",
    });

  const user = JSON.parse(localStorage.getItem("user"));
const [users, setUsers] = useState([]);

const fetchUsers = async () => {
  try {
    const resUsers = await fetch("http://127.0.0.1:8000/api/users");
    const usersData = await resUsers.json();

    const resFaculty = await fetch("http://127.0.0.1:8000/api/faculty");
    const facultyData = await resFaculty.json();

    // 👉 kunin lahat ng user_id na nasa faculty
    const facultyUserIds = facultyData.map(f => f.user_id);

    // 👉 filter users na WALA pa sa faculty
    const filteredUsers = usersData.filter(
      user => !facultyUserIds.includes(user.id)
    );

    setUsers(filteredUsers);

  } catch (err) {
    console.error(err);
  }
};

  // ✅ LOAD DATA + AUTH CHECK
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }

    fetchFaculty();
    fetchUsers();
  }, []);
  console.log(users);

  // ✅ FETCH FUNCTION
  const fetchFaculty = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/faculty");
      const data = await res.json();
      setFacultyList(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // ✅ INPUT CHANGE
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  const filteredFaculty = facultyList.filter((f) => {
  const matchSearch =
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.email?.toLowerCase().includes(search.toLowerCase());

  const matchDepartment =
    departmentFilter === "" || f.department === departmentFilter;

  return matchSearch && matchDepartment;
});

  // ✅ SUBMIT
const handleSubmit = async (e) => {
  e.preventDefault();

  let newErrors = {};

  // ✅ validation
  if (!form.user_id) newErrors.name = "Required";
  if (!form.name) newErrors.name = "Required";
  if (!form.department) newErrors.department = "Required";
  if (!form.employeeId) newErrors.employeeId = "Required";
  if (!form.position) newErrors.position = "Required";
  if (!form.email) newErrors.email = "Required";
  if (!form.phone) newErrors.phone = "Required";

  // ❌ stop if may error
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setErrors({}); // clear errors

  try {
    await fetch("http://127.0.0.1:8000/api/faculty", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
      
    fetchUsers();
    fetchFaculty();
    setShowModal(false);

    setForm({
       user_id: "",
      name: "",
      department: "",
      employeeId: "",
      position: "",
      email: "",
      phone: "",
      status: "Active",
    });

  } catch (error) {
    console.error(error);
  }
};

const handleEdit = (faculty) => {
  setForm({
    user_id: faculty.user_id || "",
    name: faculty.user?.name || "",
    department: faculty.department || "",
    employeeId: faculty.employeeId || "",
    position: faculty.position || "",
    email: faculty.user?.email || "",
    phone: faculty.phone || "",
    status: faculty.status || "Active",
  });

  setShowModal(true);
};

  return (
    <div className="h-screen w-screen flex overflow-hidden">

      {/* SIDEBAR */}
      <div className="w-64 bg-gradient-to-b from-blue-800 to-blue-600 text-white flex flex-col p-5">
        <div className="flex items-center gap-3 mb-10">
          <img src="/images/logo.png" className="w-10 h-10" />
          <div>
            <p className="font-semibold text-sm">OMSC</p>
            <p className="text-xs text-white/70">Faculty Profiling System</p>
          </div>
        </div>

        <Sidebar />


        <button onClick={logout} className="mt-auto bg-red-500 p-2 rounded">
          Logout
        </button>
      </div>

       {/* MAIN */}
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">

        {/* HEADER ROW (LIKE IMAGE) */}
        <div className="flex items-center justify-between mb-6 gap-4">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-4 flex-1">
            <h1 className="text-2xl font-bold whitespace-nowrap">Faculty</h1>

           
          </div>



          {/* PROFILE RIGHT */}
         <ProfileHeader />
        </div>

 <div className="flex items-center justify-between mb-6 gap-4">
         {/* SEARCH */}
<input
  type="text"
  placeholder="Search faculty..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="flex-1 p-2 rounded border"
/>

{/* FILTER */}
<select
  value={departmentFilter}
  onChange={(e) => setDepartmentFilter(e.target.value)}
  className="p-2 rounded border"
>
  <option value="">All Departments</option>
  <option value="BSIT">BSIT</option>
  <option value="BEED">BEED</option>
  <option value="BSBA-OM">BSBA-OM</option>
  <option value="BSBA-FM">BSBA-FM</option>
</select>

            {/* ADD BUTTON */}
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded whitespace-nowrap"
            >
              + Add Faculty
            </button>

</div>
{/* GRID */}
        <div className="grid grid-cols-3 gap-4">
          {filteredFaculty.map((f, index) => (
            <div key={index} className="bg-white p-4 rounded shadow">
              <p className="font-semibold">{f.name}</p>
              <p className="text-sm text-gray-500">{f.department}</p>
            </div>
          ))}
        </div>

</div>


 {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white w-[600px] rounded-xl p-6">

            <div className="flex justify-between mb-4">
              <h2 className="font-semibold text-lg">Add Faculty</h2>
              <button onClick={() => setShowModal(false)}>✖</button>
            </div>

           <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

  {/* NAME */}
  <div className="flex flex-col">
    <select
  name="user_id"
  value={form.user_id}
onChange={(e) => {
  const selectedId = e.target.value;

  const selectedUser = users.find(u => u.id === Number(selectedId));

  setForm(prev => ({
    ...prev,
    user_id: selectedId,
    name: selectedUser?.name || "",
    email: selectedUser?.email || "",
  }));
}}
  className={`p-2 border rounded ${errors.name ? "border-red-500" : ""}`}
>
  <option value="">Select User</option>
  {users.map((u) => (
    <option key={u.id} value={u.id}>
      {u.name}
    </option>
  ))}
</select>
    <span className="text-red-500 text-xs min-h-[16px]">
      {errors.name}
    </span>
  </div>

  {/* DEPARTMENT */}
  <div className="flex flex-col">
    <select
      name="department"
      value={form.department}
      onChange={handleChange}
      className={`p-2 border rounded ${errors.department ? "border-red-500" : ""}`}
    >
      <option value="">Department</option>
      <option>BSIT</option>
      <option>BEED</option>
      <option>BSBA-OM</option>
      <option>BSBA-FM</option>
    </select>
    <span className="text-red-500 text-xs min-h-[16px]">
      {errors.department}
    </span>
  </div>

  {/* EMPLOYEE ID */}
  <div className="flex flex-col">
    <input
      name="employeeId"
      value={form.employeeId}
      onChange={handleChange}
      placeholder="Employee ID"
      className={`p-2 border rounded ${errors.employeeId ? "border-red-500" : ""}`}
    />
    <span className="text-red-500 text-xs min-h-[16px]">
      {errors.employeeId}
    </span>
  </div>

  {/* POSITION */}
  <div className="flex flex-col">
    <input
      name="position"
      value={form.position}
      onChange={handleChange}
      placeholder="Position"
      className={`p-2 border rounded ${errors.position ? "border-red-500" : ""}`}
    />
    <span className="text-red-500 text-xs min-h-[16px]">
      {errors.position}
    </span>
  </div>

  {/* EMAIL */}
  <div className="flex flex-col">
    <input
      name="email"
      value={form.email}
      onChange={handleChange}
      placeholder="Email"
      className={`p-2 border rounded ${errors.email ? "border-red-500" : ""}`}
    />
    <span className="text-red-500 text-xs min-h-[16px]">
      {errors.email}
    </span>
  </div>

  {/* PHONE */}
  <div className="flex flex-col">
    <input
      name="phone"
      value={form.phone}
      onChange={handleChange}
      placeholder="Phone"
      className={`p-2 border rounded ${errors.phone ? "border-red-500" : ""}`}
    />
    <span className="text-red-500 text-xs min-h-[16px]">
      {errors.phone}
    </span>
  </div>

  {/* BUTTONS */}
  <div className="col-span-2 flex justify-end gap-3">
    <button
      type="button"
      onClick={() => setShowModal(false)}
      className="border px-4 py-1 rounded"
    >
      Cancel
    </button>
    <button
      type="submit"
      className="bg-blue-600 text-white px-4 py-1 rounded"
    >
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