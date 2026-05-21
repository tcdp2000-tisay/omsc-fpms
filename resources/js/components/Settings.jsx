import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ProfileHeader from "../components/ProfileHeader";
import axios from "axios";
import Sidebar from "../components/Sidebar";

export default function Settings() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: ""
  });

  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("account");

  // ✅ INIT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");

    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, []);

  // ✅ LOAD USERS
  useEffect(() => {
    if (activeTab === "users") {
      const token = localStorage.getItem("token");

      axios.get("http://127.0.0.1:8000/api/users", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUsers(res.data))
      .catch(err => console.log(err));
    }
  }, [activeTab]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const token = localStorage.getItem("token");

    axios.put("http://127.0.0.1:8000/api/user/update", form, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      alert("Updated!");
      localStorage.setItem("user", JSON.stringify(res.data));
      window.location.reload();
    })
    .catch(() => alert("Error updating profile"));
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const changePassword = () => {
    const token = localStorage.getItem("token");

    axios.post("http://127.0.0.1:8000/api/change-password", passwordData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      alert(res.data.message);
      setPasswordData({ current_password: "", new_password: "" });
    })
    .catch(err => {
      alert(err.response?.data?.message || "Error");
    });
  };

const updateRole = async (id, role) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.put(
      `http://127.0.0.1:8000/api/users/${id}/role`,
      { role },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    // ✅ AUTO UPDATE UI (NO RELOAD)
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === id ? { ...user, role: role } : user
      )
    );

  } catch (error) {
    console.log(error.response);
    alert("Failed to update role");
  }
};


const currentUser = JSON.parse(localStorage.getItem("user"));

return (
    <div className="h-screen w-screen flex overflow-hidden">

      {/* SIDEBAR */}
      <div className="w-64 bg-gradient-to-b from-blue-800 to-blue-600 text-white flex flex-col p-5">

        <div className="flex items-center gap-3 mb-10">
          <img src="/images/logo.png" className="w-10 h-10" />
          <div>
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

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-gray-500 text-sm">Manage system settings and user access</p>
          </div>
          <ProfileHeader />
        </div>

        <div className="flex gap-6">

          {/* MENU */}
          <div className="w-1/4 bg-white rounded-xl shadow p-4">
            <h2 className="font-semibold mb-4">Settings Menu</h2>

            <div className="flex flex-col gap-3 text-sm">
              <button onClick={() => setActiveTab("account")} className={`p-2 rounded ${activeTab==="account"?"bg-gray-100":"hover:bg-gray-100"}`}>🔒 Account</button>
              
             
              {/* {currentUser?.role === "admin" && (
              )}  */}

              {currentUser?.role === "admin" && (
                <button
                  onClick={() => setActiveTab("users")}
                  className={`p-2 rounded ${
                    activeTab === "users" ? "bg-gray-100" : "hover:bg-gray-100"
                  }`}
                >
                  👥 Users
                </button>
              )}
          
              </div>
          </div>

          {/* CONTENT */}
          <div className="flex-1 flex flex-col gap-6">

            {activeTab === "account" && (
              <>
                {/* PROFILE */}
                <div className="bg-white rounded-xl shadow p-4">
                  <h2 className="font-semibold mb-4">Account Settings</h2>

                  <form onSubmit={(e)=>{e.preventDefault();handleSave();}}>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" name="name" value={form.name} onChange={handleChange} className="p-2 border rounded"/>
                      <input type="email" name="email" value={form.email} onChange={handleChange} className="p-2 border rounded"/>
                    </div>

                    <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
                      Save Changes
                    </button>
                  </form>
                </div>

                {/* PASSWORD */}
                <div className="bg-white rounded-xl shadow p-4">
                  <h2 className="font-semibold mb-4">Security</h2>

                  <input type="password" name="current_password" value={passwordData.current_password} onChange={handlePasswordChange} placeholder="Current Password" className="p-2 border rounded mb-2"/>
                  <input type="password" name="new_password" value={passwordData.new_password} onChange={handlePasswordChange} placeholder="New Password" className="p-2 border rounded mb-2"/>

                  <button onClick={changePassword} className="bg-blue-600 text-white px-4 py-2 rounded">
                    Change Password
                  </button>
                </div>
              </>
            )}

            {activeTab === "users" && (
              <div className="bg-white rounded-xl shadow p-4">
                <h2 className="font-semibold mb-4">User Management</h2>

                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2">Name</th>
                      <th className="p-2">Email</th>
                      <th className="p-2">Role</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className="border-b">
                        <td className="p-2">{user.name}</td>
                        <td className="p-2">{user.email}</td>
                        <td className="p-2">
                          <label><input type="radio" checked={user.role==="admin"} onChange={()=>updateRole(user.id,"admin")} /> Admin</label>
                          <label className="ml-2"><input type="radio" checked={user.role==="faculty"} onChange={()=>updateRole(user.id,"faculty")} /> Faculty</label>
                          <label className="ml-2"><input type="radio" checked={user.role==="user"} onChange={()=>updateRole(user.id,"user")} /> User</label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}