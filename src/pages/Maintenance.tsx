// src/Maintenance.tsx
export default function Maintenance() {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#111827",
          color: "white",
          flexDirection: "column",
          textAlign: "center",
          padding: "1rem",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>🚧 Site Under Maintenance 🚧</h1>
        <p style={{ fontSize: "1.2rem" }}>
          We’ll be back in action soon! <br />
          This site will resume after 1 day.
        </p>
      </div>
    );
  }
  