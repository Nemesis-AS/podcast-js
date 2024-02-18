import React from "react";
import { NavLink } from "react-router-dom";

// Debug
import ToastTest from "../utils/ToastTest";

const Navbar = () => {
  return (
    <nav className="flex flex-col gap-4 py-8 pl-4 bg-slate-700 text-slate-50 shrink-0">
        <NavLink to="/" className={({isActive}) => (isActive ? "active" : undefined)}>View Podcasts</NavLink>
        <NavLink to="/add-podcast" className={({isActive}) => (isActive ? "active" : undefined)}>Add Podcasts</NavLink>
        <NavLink to="/options" className={({isActive}) => (isActive ? "active" : undefined)}>Options</NavLink>
        <ToastTest />
    </nav>
  )
};

export default Navbar;
