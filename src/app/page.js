import WebSocketComponent from "./WebSocketComponent";

export default function Home() {
  return (
    <main className="bg-transparent">
      <WebSocketComponent wsUrl="wss://geke.hermannstadtpfarrkirche.online/ws" />
    </main>
  );
}
