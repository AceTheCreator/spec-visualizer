import Tree from "react-d3-tree";
import Nodes from "../components/Nodes/Nodes";
import { useState, useCallback } from "react";
// import "reactflow/dist/style.css";
import initialNodes from "../configs/2.5.0.json";

const useCenteredTree = (defaultTranslate = { x: 0, y: 0 }) => {
  const [translate, setTranslate] = useState(defaultTranslate);
  const [dimensions, setDimensions] = useState();
  const containerRef = useCallback((containerElem) => {
    if (containerElem !== null) {
      const { width, height } = containerElem.getBoundingClientRect();
      setDimensions({ width, height });
      setTranslate({ x: width / 2, y: height / 2 });
    }
  }, []);
  return [dimensions, translate, containerRef];
};

const containerStyles = {
  width: "100vw",
  height: "100vh",
};


export default function Home() {
  const [dimensions, translate, containerRef] = useCenteredTree();
  return (
    <Nodes />
    // <div style={containerStyles} ref={containerRef}>
    //   <Tree
    //     data={initialNodes}
    //     dimensions={dimensions}
    //     translate={translate}
    //   />
    // </div>
  );
}
