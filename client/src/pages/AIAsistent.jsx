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
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">AI Asistent</h1>
          <button
            onClick={() => navigate("/")}
            className="border border-gray-200 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm transition-colors duration-150 cursor-pointer"
          >
            ← Nazad
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 min-h-96 flex flex-col gap-3 mb-4 overflow-y-auto max-h-[60vh]">
          {messages.map((msg, i) => {
            const isUser = msg.role === "user";
            return (
              <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm shrink-0 mr-2 self-end">
                    🤖
                  </div>
                )}
                <div
                  className={`px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap break-words max-w-xs ${
                    isUser
                      ? "bg-purple-600 text-white rounded-xl rounded-tr-sm ml-auto"
                      : "bg-white border border-gray-200 text-gray-800 rounded-xl rounded-tl-sm"
                  }`}
                >
                  {msg.content}
                </div>
                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm shrink-0 ml-2 self-end">
                    👤
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-start items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm shrink-0">
                🤖
              </div>
              <div className="bg-white border border-gray-200 rounded-xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
                {[0, 1, 2].map((n) => (
                  <span
                    key={n}
                    className="w-2 h-2 rounded-full bg-purple-400 inline-block animate-bounce"
                    style={{ animationDelay: `${n * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-3 flex gap-3 items-end">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Unesite poruku..."
            rows={1}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 max-h-28 overflow-y-auto"
          />
          <button
            onClick={posaljiPoruku}
            disabled={!inputText.trim() || loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer whitespace-nowrap"
          >
            Pošalji
          </button>
        </div>
      </div>
    </div>
  );
}
