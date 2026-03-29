"use client";
export default function Error({ error, reset }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100vh", background:"#0f1117", color:"#e8e4de", gap:16 }}>
      <p style={{ color:"#f87171" }}>Something went wrong.</p>
      <button onClick={reset} style={{ padding:"8px 20px", border:"1.5px solid #2a2d3a", borderRadius:20, background:"transparent", color:"#e8e4de", cursor:"pointer" }}>Try again</button>
    </div>
  );
}
