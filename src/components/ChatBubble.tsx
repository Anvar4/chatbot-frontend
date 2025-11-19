import React from "react";

interface ChatBubbleProps {
  text: string;
  fromUser?: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ text, fromUser = false }) => {

  const formatText = (input: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return input.split(urlRegex).map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline"
          >
            {part}
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div
      className={`flex w-full mb-1 ${
        fromUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[75%] px-4 py-2 rounded-2xl shadow 
        ${fromUser ? 
          "bg-blue-600 text-white rounded-br-none" : 
          "bg-gray-700 text-gray-200 rounded-bl-none"
        }`}
      >
        <div className="whitespace-pre-wrap break-words">
          {formatText(text)}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
