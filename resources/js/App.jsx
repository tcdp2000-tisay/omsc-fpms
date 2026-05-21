import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Faculty from "./components/Faculty";
import Departments from "./components/Departments";
import Reports from "./components/Reports";
import Settings from "./components/Settings";
import Profile from "./components/Profile";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/faculty/:id" element={<Profile />} />
        <Route path="/profile/:id" element={<Profile />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;