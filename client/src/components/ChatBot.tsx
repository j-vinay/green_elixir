import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Bot, User, Send } from "lucide-react";

interface ChatMessage {
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ChatBotProps {
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
  messages?: ChatMessage[];
}

export default function ChatBot({ onSendMessage, isLoading, messages = [] }: ChatBotProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSendMessage?.(input.trim());
    setInput("");
  };

  const quickSuggestions = [
    "Digestive issues",
    "Stress & anxiety",
    "Sleep problems", 
    "Joint pain"
  ];

  return (
    <Card className="shadow-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-primary text-primary-foreground p-6 flex items-center space-x-3">
        <div className="w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-semibold">Ayurveda AI Assistant</h3>
          <p className="text-sm text-primary-foreground/80">
            Powered by Natural Language Processing
          </p>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex items-start space-x-3 ${
            message.type === 'user' ? 'justify-end' : ''
          }`}>
            {message.type === 'ai' && (
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
            )}
            
            <div className={`rounded-2xl p-4 max-w-md ${
              message.type === 'user' 
                ? 'bg-primary text-primary-foreground rounded-tr-none' 
                : 'bg-muted rounded-tl-none'
            }`}>
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-70 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
            
            {message.type === 'user' && (
              <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-secondary" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-muted rounded-2xl rounded-tl-none p-4 max-w-xs">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <span className="text-sm text-muted-foreground ml-2">Analyzing...</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Chat Input */}
      <div className="border-t border-border p-6">
        <div className="flex space-x-3">
          <Textarea
            placeholder="Describe your symptoms or health concerns..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 min-h-[48px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            data-testid="textarea-chat-input"
          />
          <Button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="flex items-center space-x-2"
            data-testid="button-send-chat"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Quick Suggestions */}
        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-2">Quick suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => setInput(suggestion)}
                className="text-xs rounded-full"
                data-testid={`button-quick-${suggestion.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
