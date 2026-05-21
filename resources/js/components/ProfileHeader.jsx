import { useNavigate } from "react-router-dom";

export default function ProfileHeader() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

 
const goToProfile = () => {
  
  navigate(`/profile/${user?.id}`);
};


  return (
    <div
      onClick={goToProfile}
      className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow cursor-pointer hover:bg-gray-100 transition"
    >
      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
        👤
      </div>

      <div className="text-sm">
        <p className="font-semibold">{user?.name}</p>
        <p className="text-gray-500 text-xs">{user?.email}</p>
      </div>
    </div>
  );
}