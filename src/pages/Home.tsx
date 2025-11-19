import React, { useState } from "react";
import ChatBubble from "../components/ChatBubble";
import VoiceRecorder from "../components/VoiceRecorder";
import { Copy, RotateCcw, ThumbsUp, ThumbsDown, Share2, ArrowUp, FileText } from "lucide-react";

interface Message {
  text: string;
  fromUser: boolean;
  isAudio?: boolean;
  audioUrl?: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Salom! 👋 Qanday yordam bera olaman? Matematik masala, dasturlash, til tarjima yoki boshqa savollaringiz bo'lsa, men sizga yordam berishdan mamnun bo'laman!",
      fromUser: false
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendText = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { text: input, fromUser: true };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userMsg.text })
      });

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { text: data.reply, fromUser: false }
      ]);
    } catch (err) {
      console.error("Text Error:", err);
      setMessages(prev => [
        ...prev,
        { text: "Kechirasiz, hozirda server bilan bog'lanishda muammo bor. Iltimos, qayta urinib ko'ring.", fromUser: false }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sendVoice = async (blob: Blob) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("voice", blob, "voice.webm");

    try {
      const res = await fetch("http://localhost:8080/api/voice",  {
        method: "POST",
        body: formData
      });

      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      setMessages(prev => [
        ...prev,
        {
          text: "Audio javob",
          fromUser: false,
          isAudio: true,
          audioUrl
        }
      ]);

      new Audio(audioUrl).play();
      
    } catch (err) {
      console.error("Voice Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendText();
    }
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white flex flex-col">
      <div className=" bg-[#0a0a0b] sticky top-0 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-50 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className=" text-2xl font-bold">✓ <span className='text-2xl'>CHATBOT.UZ</span></span>
          </div>
          <button className="w-8 h-8 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg flex items-center justify-center transition-colors">
            <FileText className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg flex items-center justify-center transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
        
        <h1 className="absolute left-1/2 transform -translate-x-1/2">
          Salom va yordam berish haqida savol
        </h1>
        
        <button className="w-8 h-8 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg flex items-center justify-center transition-colors">
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8 max-w-4xl w-full mx-auto">
        <div className="flex flex-col gap-6">
          {messages.map((msg, idx) => (
            <div key={idx} className="flex flex-col gap-3">
              <ChatBubble text={msg.text} fromUser={msg.fromUser} />

              {!msg.fromUser && (
                <div className="flex items-center gap-2 ml-4">
                  <button className="p-1.5 hover:bg-[#2a2a2a] rounded-lg transition-colors">
                    <Copy className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-1.5 hover:bg-[#2a2a2a] rounded-lg transition-colors">
                    <RotateCcw className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-1.5 hover:bg-[#2a2a2a] rounded-lg transition-colors">
                    <ThumbsUp className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-1.5 hover:bg-[#2a2a2a] rounded-lg transition-colors">
                    <ThumbsDown className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-1.5 hover:bg-[#2a2a2a] rounded-lg transition-colors">
                    <Share2 className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              )}

              {msg.isAudio && msg.audioUrl && (
                <audio controls src={msg.audioUrl} className="mt-2 rounded-lg w-full max-w-md" />
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-2 items-center text-gray-400">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#0a0a0b] sticky bottom-0 border-t border-gray-800 px-6 py-4">
        <div className=" max-w-4xl w-full mx-auto">
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-700 p-4">
            <input
              type="text"
              className="
                w-full
                bg-transparent
                text-white
                placeholder-gray-500
                focus:outline-none
                mb-4
              "
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Chatbotga yozing..."
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                
              </div>

              <div className="flex items-center gap-2">
                <VoiceRecorder onStop={sendVoice} />
                <button
                  onClick={sendText}
                  disabled={!input.trim()}
                  className={`
                    p-5
                    rounded-lg
                    transition-colors
                    ${
                      input.trim()
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-[#2a2a2a] text-gray-500 cursor-not-allowed"
                    }
                  `}
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          <p className="text-center text-gray-500 text-xs mt-3">
            © 2024 Chatbot. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>
    </div>
  );
}
