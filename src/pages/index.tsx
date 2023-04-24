import Dropdown from "@/components/Navigation/Dropdown";
import Sidebar from "@/components/Navigation/Sidebar";
import { useState } from "react";
import Nodes from "../components/Nodes/Nodes";
import versions from "../configs/specVersions.json";
import { NodeType } from "@/types/nodes";

export default function Home() {
  const [currentNode, setCurrentNode] = useState();
  const [nodes, passNodes] = useState();
  return (
    <div>
      <div className="body-wrapper">
        <div className="w-[60%] flex flex-col bg-gray-100">
          <div className="px-3 mt-1 mb-4 h-[10px]">
            <Dropdown lists={versions} query="version" />
          </div>
          <div className="m-3 bg-white rounded-lg drop-shadow-1xl">
            <Nodes setCurrentNode={setCurrentNode} passNodes={passNodes} />
          </div>
        </div>
        <Sidebar
          node={currentNode}
          nodes={nodes}
          setCurrentNode={setCurrentNode}
        />
      </div>
    </div>
  );
}
