import React from "react";
import type { JSX } from "react";
import { Link } from "react-router";

const Navbar: () => JSX.Element = () => {
  return (
    <nav className="navbar">
      <Link className="text-2xl font-bold text-gradient" to="/">
        ResumeIND
      </Link>
      <Link to="/upload-resume" className="primary-button w-fit">
        Upload Resume
      </Link>
    </nav>
  );
};

export default Navbar;
