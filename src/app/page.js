import WebSocketComponent from "./WebSocketComponent";

export default function Home() {
  return (
    <main className="bg-transparent">
      <WebSocketComponent wsUrl="ws://localhost:3000/ws" />
    </main>
  );
}
