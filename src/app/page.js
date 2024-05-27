import WebSocketComponent from "./WebSocketComponent";

export default function Home() {
  return (
    <main className="bg-transparent">
      <WebSocketComponent wsUrl="ws://geke.hermannstadtpfarrkirche.online/ws" />
    </main>
  );
}
