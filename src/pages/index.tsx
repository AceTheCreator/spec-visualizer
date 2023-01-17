import Nodes from '@/components/Nodes/Nodes';
import 'reactflow/dist/style.css';

export default function Home() {
  return (
    <div style={{
      width: "100%",
      height: "100vh"
    }}>
      <Nodes />
    </div>
  );
}
