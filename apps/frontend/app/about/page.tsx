// app/about/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAuthors } from "@/lib/api";

export const metadata: Metadata = {
  title: "Про нас — IT Blog",
  description:
    "IT Blog — незалежне українське медіа про технології. Дізнайтесь про нашу редакцію, місію та редакційну політику.",
};

export const revalidate = 86400;

export default async function AboutPage() {
  const authors = await getAuthors();

  return (
    <main className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-badge">Про нас</div>
        <h1 className="about-hero-title">IT Blog — технології простою мовою</h1>
        <p className="about-hero-sub">
          Незалежне українське медіа для розробників. Пишемо про Frontend,
          Backend, DevOps, AI та інструменти які реально використовуються в роботі.
        </p>
      </section>

      {/* Mission */}
      <section className="about-section">
        <h2 className="about-section-title">Наша місія</h2>
        <p className="about-text">
          Ми віримо що якісні технічні знання мають бути доступні українською
          мовою. Кожна стаття — це практичний досвід, а не переклад документації.
          Ми пишемо те що самі використовуємо в роботі щодня.
        </p>
        <div className="about-values">
          {[
            {
              icon: "🎯",
              title: "Практичність",
              text: "Жодної теорії заради теорії. Кожна стаття містить реальний код, кейси або покроковий гід.",
            },
            {
              icon: "🇺🇦",
              title: "Українською",
              text: "Весь контент створюється українською мовою. Технічний жаргон пояснюється зрозуміло.",
            },
            {
              icon: "✅",
              title: "Перевірено",
              text: "Статті публікуються лише після технічної перевірки. Застарілий контент оновлюється.",
            },
          ].map((v) => (
            <div key={v.title} className="about-value-card">
              <span className="about-value-icon">{v.icon}</span>
              <h3 className="about-value-title">{v.title}</h3>
              <p className="about-value-text">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial policy */}
      <section className="about-section about-section-alt">
        <h2 className="about-section-title">Редакційна політика</h2>
        <ul className="about-policy-list">
          <li>Статті пишуться практикуючими розробниками з мінімум 2 роками досвіду у відповідній темі.</li>
          <li>Весь код перевіряється та тестується перед публікацією.</li>
          <li>Ми не публікуємо рекламний контент без явної позначки "Sponsored".</li>
          <li>Помилки в статтях виправляються протягом 48 годин після сповіщення.</li>
          <li>Застарілі статті позначаються датою останнього оновлення.</li>
          <li>Зовнішні посилання перевіряються на достовірність джерела.</li>
        </ul>
      </section>

      {/* Team */}
      <section className="about-section">
        <h2 className="about-section-title">Редакція</h2>
        <p className="about-text" style={{ marginBottom: "32px" }}>
          Наша команда — розробники які поєднують практичну роботу з написанням
          статей. Ми не журналісти — ми практики.
        </p>
        <div className="about-team-grid">
          {authors.map((author) => (
            <Link
              key={author.id}
              href={`/authors/${author.slug}`}
              className="about-team-card"
            >
              {author.avatar && (
                <Image
                  src={author.avatar}
                  alt={author.name}
                  width={72}
                  height={72}
                  className="avatar-lg"
                />
              )}
              <div>
                <p className="about-team-name">{author.name}</p>
                <p className="about-team-bio">{author.bio}</p>
                <p className="about-team-count">
                  {author.articlesCount} статей
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Facts */}
      <section className="about-section about-section-alt">
        <h2 className="about-section-title">Цифри</h2>
        <div className="about-stats">
          {[
            { value: "2026", label: "Рік заснування" },
            { value: "10+", label: "Статей опубліковано" },
            { value: "5", label: "Категорій" },
            { value: "2", label: "Автори в редакції" },
          ].map((s) => (
            <div key={s.label} className="about-stat">
              <p className="about-stat-value">{s.value}</p>
              <p className="about-stat-label">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="about-section">
        <h2 className="about-section-title">Контакти</h2>
        <p className="about-text">
          Маєш питання, знайшов помилку або хочеш написати статтю для нас?
          Напиши нам — відповідаємо протягом 24 годин.
        </p>
        <div className="about-contacts">
          <a href="mailto:hello@itblog.pp.ua" className="about-contact-link">
            ✉️ hello@itblog.pp.ua
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="about-contact-link"
          >
            GitHub організація
          </a>
        </div>
      </section>
    </main>
  );
}
