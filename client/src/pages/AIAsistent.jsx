import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AIAsistent() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Zdravo! Ja sam vaš AI asistent za planiranje izgradnje. Kako vam mogu pomoći?" },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function posaljiPoruku() {
    const text = inputText.trim();
    if (!text || loading) return;

    const novaPorukaKorisnik = { role: "user", content: text };
    const azuriraneporuke = [...messages, novaPorukaKorisnik];

    setMessages(azuriraneporuke);
    setInputText("");
    setLoading(true);

    try {
      const res = await fetch("https://planer-izgradnje-api.onrender.com/api/ai/poruka", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: azuriraneporuke }),
      });

      const data = await res.json();
      console.log(data);
      const odgovor = { role: "assistant", content: data.odgovor };
      setMessages((prev) => [...prev, odgovor]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Greška pri povezivanju sa serverom." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      posaljiPoruku();
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#f0f2f5", fontFamily: "Segoe UI, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#1a73e8", color: "#fff", padding: "14px 20px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}>
        <button
          onClick={() => navigate('/')}
          style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: "8px", padding: "6px 14px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}
        >
          ← Nazad
        </button>
        <span style={{ fontSize: "18px", fontWeight: "700" }}>AI Asistent</span>
        <span style={{ fontSize: "13px", opacity: 0.8, marginLeft: "auto" }}>Planiranje izgradnje</span>
      </div>

      {/* Poruke */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {messages.map((msg, i) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={i}
              style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}
            >
              {!isUser && (
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#1a73e8", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0, marginRight: "8px", alignSelf: "flex-end" }}>
                  🤖
                </div>
              )}
              <div
                style={{
                  maxWidth: "65%",
                  background: isUser ? "#1a73e8" : "#fff",
                  color: isUser ? "#fff" : "#1a1a1a",
                  padding: "10px 14px",
                  borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                  fontSize: "15px",
                  lineHeight: "1.5",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {msg.content}
              </div>
              {isUser && (
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#34a853", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0, marginLeft: "8px", alignSelf: "flex-end" }}>
                  👤
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#1a73e8", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
              🤖
            </div>
            <div style={{ background: "#fff", borderRadius: "18px 18px 18px 4px", padding: "12px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.1)", display: "flex", gap: "5px", alignItems: "center" }}>
              {[0, 1, 2].map((n) => (
                <span
                  key={n}
                  style={{
                    width: "8px", height: "8px", borderRadius: "50%", background: "#1a73e8",
                    display: "inline-block",
                    animation: "bounce 1.2s infinite",
                    animationDelay: `${n * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ background: "#fff", padding: "12px 16px", display: "flex", gap: "10px", alignItems: "flex-end", borderTop: "1px solid #e0e0e0", boxShadow: "0 -2px 6px rgba(0,0,0,0.05)" }}>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Unesite poruku..."
          rows={1}
          style={{
            flex: 1,
            resize: "none",
            border: "1.5px solid #d0d7de",
            borderRadius: "12px",
            padding: "10px 14px",
            fontSize: "15px",
            outline: "none",
            fontFamily: "inherit",
            lineHeight: "1.5",
            maxHeight: "120px",
            overflowY: "auto",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#1a73e8")}
          onBlur={(e) => (e.target.style.borderColor = "#d0d7de")}
        />
        <button
          onClick={posaljiPoruku}
          disabled={!inputText.trim() || loading}
          style={{
            background: !inputText.trim() || loading ? "#b0c4e8" : "#1a73e8",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            padding: "10px 20px",
            fontSize: "15px",
            fontWeight: "600",
            cursor: !inputText.trim() || loading ? "not-allowed" : "pointer",
            transition: "background 0.2s",
            whiteSpace: "nowrap",
          }}
        >
          Pošalji
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
