import logo from "../assets/logo.png";

export function SectionHeader() {
  return (
    <section
      style={{
        height: "80%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "2rem 0 0",
        gap: "8px",
      }}
    >
      <img
        style={{
          width: "10vw",
          height: "auto",
        }}
        src={logo}
        alt="Pilot Logix"
      />
    </section>
  );
}
