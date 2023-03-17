import Sidebar from "@/components/Navigation/Sidebar";
import { useState } from "react";
import Nodes from "../components/Nodes/Nodes";

export default function Home() {
  const [currentNode, setCurrentNode] = useState({})
  const [nodes, passNodes] = useState();
  return (
    <div>
      <div className="body-wrapper">
        <Nodes setCurrentNode={setCurrentNode} passNodes={passNodes} />
        <Sidebar
          node={currentNode}
          nodes={nodes}
          setCurrentNode={setCurrentNode}
        />
      </div>
    </div>
  );
}
