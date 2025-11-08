"use client";
import { useThemeToggle } from "@/hooks/useThemeToggle";

export default function Home() {
  const { isDark, toggleTheme } = useThemeToggle();

  return (
    <div
      className="min-h-screen  transition-colors"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--text-primary)",
      }}
    >
      {/* Header */}
      <header
        className="p-4 mb-8 rounded"
        style={{ backgroundColor: "var(--header-bg)" }}
      >
        <h1 className="text-3xl font-bold">Theme Test Header</h1>
        <p style={{ color: "var(--text-secondary)" }}>
          This is secondary text in the header
        </p>
      </header>

      {/* Buttons */}
      <div className="mb-8 flex gap-4">
        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded transition"
          style={{
            backgroundColor: "var(--button-bg)",
            color: "var(--button-text)",
            border: "1px solid var(--border)",
          }}
        >
          {isDark ? "🌙 Dark" : "🌞 Light"} Mode
        </button>
        <button
          className="px-4 py-2 rounded transition"
          style={{
            backgroundColor: "var(--accent)",
            color: "#fff",
            border: "1px solid var(--border)",
          }}
        >
          Accent Button
        </button>
      </div>

      {/* Card / Panel */}
      <div
        className="p-6 rounded shadow-md max-w-md"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        <h2 className="text-2xl font-semibold mb-2">Card Title</h2>
        <p style={{ color: "var(--text-muted)" }}>
          This is some example text inside a card or panel. It uses the muted
          text color.
        </p>
        <button
          className="mt-4 px-3 py-1 rounded transition"
          style={{
            backgroundColor: "var(--button-bg)",
            color: "var(--button-text)",
            border: "1px solid var(--border)",
          }}
        >
          Card Button
        </button>
      </div>

      {/* Paragraph Text */}
      <section className="mt-8 max-w-prose">
        <p style={{ color: "var(--text-primary)" }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis euismod,
          nisl vel tincidunt lacinia, nunc sapien vehicula risus, ut volutpat ex
          odio at sapien.
        </p>
        <p style={{ color: "var(--text-secondary)" }}>
          Secondary text example, for less important info.
        </p>
        <p style={{ color: "var(--text-muted)" }}>
          Muted text example, for notes or disclaimers.
        </p>
      </section>
    </div>
  );
}
