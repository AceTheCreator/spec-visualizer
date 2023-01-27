import Sidebar from "@/components/Navigation/Sidebar";
import { useState } from "react";
import Nodes from "../components/Nodes/Nodes";

export default function Home() {
  const [currentNode, setCurrentNode] = useState({})
  return (
    <div>
      <div className="body-wrapper">
        <Nodes setCurrentNode={setCurrentNode}  />
        <Sidebar node={currentNode} />
      </div>
    </div>
  );
}
