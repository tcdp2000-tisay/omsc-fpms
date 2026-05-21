import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";


export default function Profile() {
   const { id } = useParams(); // 🔥 FIX
  const [faculty, setFaculty] = useState(null);
  
    const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    };

const user = JSON.parse(localStorage.getItem("user"));

const finalId = id || user?.user_id;
 
 
useEffect(() => {
  if (!finalId) return; // 🔥 FIX

  console.log("FINAL ID:", finalId);

  axios.get(`http://127.0.0.1:8000/api/faculty/user/${finalId}`)
    .then(res => {
      console.log("DATA:", res.data);
      setFaculty(res.data);
    })
    .catch(err => console.log(err));

}, [finalId]);


 
 

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
        

      </div>

      {/* MAIN */}
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Edit Profile
          </button>
        </div>

        {/* TOP PROFILE CARD */}
        <div className="bg-blue-100 border border-blue-300 p-5 rounded-xl flex justify-between mb-4">

          {/* LEFT */}
         <div className="flex items-center gap-5 bg-white p-5 rounded-xl shadow border">

  {/* PROFILE IMAGE */}
  <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold shadow">
    {faculty?.user?.name?.charAt(0)?.toUpperCase() || "U"}
  </div>

  {/* INFO */}
<div className="flex-1">
  {/* NAME */}
  <h2 className="font-bold text-xl text-gray-800">
    {faculty?.user?.name ?? "Contact Faculty Admin"}
  </h2>

  {/* COURSE + DEPARTMENT */}
  <p className="text-sm text-gray-500">
    {faculty?.course ? faculty.course : " "} {" "}
    {faculty?.department ? faculty.department : " "}  
  </p>

  {/* CONTACT */}
  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
    <p className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
      📧 {faculty?.user?.email ?? " "}
    </p>

    <p className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
      📞 {faculty?.contact ?? " "}
    </p>
  </div>
</div>

  {/* STATUS BADGE */}
  <div>
    <span className={`px-3 py-1 text-xs rounded-full font-semibold
      ${faculty?.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}
    `}>
      {faculty?.status || "Unknown"}
    </span>
  </div>

</div>

         

        </div>

        {/* TABS */}
        <div className="flex gap-4 mb-4 text-sm">
          <button className="text-blue-600 border-b-2 border-blue-600">Personal Information</button>
          <button className="text-gray-500">Qualifications</button>
          <button className="text-gray-500">Employment</button>
          <button className="text-gray-500">Teaching</button>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-3 gap-4">

          {/* PERSONAL INFO */}
          <div className="col-span-2 bg-white p-4 rounded-xl shadow">
            <h2 className="font-semibold mb-3">Personal Information</h2>

            <div className="space-y-2 text-sm">
                <p><strong>First name:</strong> {faculty?.first_name}</p>
                <p><strong>Last name:</strong> {faculty?.last_name}</p>
                <p><strong>Gender:</strong> {faculty?.gender}</p>
                <p><strong>Email:</strong> {faculty?.user?.email}</p>
                <p><strong>Contact:</strong> {faculty?.contact}</p>
                <p><strong>Address:</strong> {faculty?.address}</p>
            </div>
          </div>

          {/* PROFILE PHOTO */}
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <h2 className="font-semibold mb-3">Profile Photo</h2>

            <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto text-3xl">
              👤
            </div>

            <button className="mt-3 text-blue-600 text-sm">
              ⬆ Change Photo
            </button>
          </div>

          {/* DEPARTMENT */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-semibold mb-2">Department & Course</h2>
            <p>BSIT</p>
          </div>

          {/* EMPLOYMENT */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-semibold mb-2">Employment Details</h2>
            <p>Full-time</p>
            <p>August 01, 2021</p>
          </div>

          {/* SUMMARY */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-semibold mb-2">Summary</h2>
            <p>Teaching Assignments: 8</p>
            <p>Subjects Handled: 5</p>
            <p>Achievements: 3</p>
          </div>

        </div>

      </div>
    </div>
  );
}