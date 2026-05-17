import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Про нас | IT-Blog",
  description: "IT-Blog — це майданчик для розробників, де ми ділимося передовим досвідом.",
};

export default function AboutPage() {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <div className="about-hero">
        <h1>Про нас</h1>
        <p>
          IT-Blog — це майданчик для розробників, де ми ділимося передовим досвідом, технічними статтями та найкращими практиками.
        </p>
      </div>

      {/* Mission Section */}
      <div className="about-section">
        <h2>Наша місія та редакційна політика</h2>
        <div style={{ color: "#57534e", lineHeight: "1.6" }}>
          <p>
            Ми прагнемо створювати якісний, достовірний та корисний контент для IT-спільноти. Наша редакційна політика базується на принципах E-E-A-T (Досвід, Експертиза, Авторитетність, Надійність).
          </p>
          <p>
            Усі матеріали проходять ретельну перевірку фактів (fact-checking). Наші автори — це практикуючі розробники та інженери, які діляться реальним досвідом та технічно точною інформацією. Ми завжди посилаємося на офіційні документації та авторитетні джерела.
          </p>
        </div>
      </div>

      {/* Founding Date */}
      <div className="about-badge">Засновано у 2026 році</div>

      {/* Contact & Socials */}
      <div className="about-section" style={{ marginBottom: "4rem" }}>
        <h3>Контакти</h3>
        <div className="about-contacts">
          <a href="mailto:contact@itblog.com" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#d97706", fontWeight: "500" }}>
            <Mail size={18} /> contact@itblog.com
          </a>
          <div style={{ color: "#d6d3d1" }}>|</div>
          <div className="social-links">
            <a href="https://twitter.com/itblog" target="_blank" rel="noopener noreferrer"><Twitter size={20} /></a>
            <a href="https://github.com/itblog" target="_blank" rel="noopener noreferrer"><Github size={20} /></a>
            <a href="https://linkedin.com/company/itblog" target="_blank" rel="noopener noreferrer"><Linkedin size={20} /></a>
          </div>
        </div>
      </div>
    </div>
  );
}
