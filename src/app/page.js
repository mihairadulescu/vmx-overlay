import WebSocketComponent from "./WebSocketComponent";

export default function Home() {
  return (
    <main className="bg-transparent">
      <WebSocketComponent wsUrl="ws://http://geke.hermannstadtpfarrkirche.online/ws" />
    </main>
  );
}
