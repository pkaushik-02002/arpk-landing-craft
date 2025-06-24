
import ChatInterface from "@/components/ChatInterface";

const Chat = () => {
  return (
    <div className="min-h-screen flex">
      {/* Chat Interface - Left Side */}
      <div className="w-1/3 max-w-md min-w-[320px] h-screen sticky top-0">
        <ChatInterface />
      </div>
      
      {/* Web Container - Right Side */}
      <div className="flex-1 bg-white dark:bg-gray-900">
        <iframe
          src="https://wc_api_pdevulapally_e185ab1523eaf902e95d0451b0ac95c3.lovableproject.com"
          className="w-full h-screen border-0"
          title="Web Container"
        />
      </div>
    </div>
  );
};

export default Chat;
