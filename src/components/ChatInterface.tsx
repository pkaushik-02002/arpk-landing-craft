
import { AI_Prompt } from "@/components/ui/animated-ai-input";

const ChatInterface = () => {
  return (
    <div className="h-full flex flex-col bg-background border-r">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Chat</h2>
      </div>
      
      <div className="flex-1 flex flex-col justify-end p-4">
        <div className="flex-1 mb-4">
          {/* Chat messages will go here */}
          <div className="text-center text-muted-foreground text-sm py-8">
            Start a conversation by typing a message below
          </div>
        </div>
        
        <AI_Prompt />
      </div>
    </div>
  );
};

export default ChatInterface;
