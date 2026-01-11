"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-brand">
          <span className="navbar-logo">⚡</span>
          <div className="navbar-brand-text">
            <span className="navbar-title">Steering Viewer</span>
            <span className="navbar-subtitle">Lethonium Experimenter</span>
          </div>
        </Link>

        <div className="navbar-links">
          <Link href="/" className={`navbar-link ${isActive("/") ? "active" : ""}`}>
            Home
          </Link>
          <Link href="/concept" className={`navbar-link ${isActive("/concept") ? "active" : ""}`}>
            Concept
          </Link>
          <Link href="/viewer" className={`navbar-link ${isActive("/viewer") ? "active" : ""}`}>
            Viewer
          </Link>
        </div>
      </div>
    </nav>
  );
}
