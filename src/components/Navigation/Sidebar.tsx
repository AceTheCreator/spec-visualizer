import toMarkdown from "@/utils/json-to-markdown";
import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import * as getMDXComponents from "../MDX";

function Sidebar({ node, nodes, setCurrentNode }) {
  const ref = useRef(null); 
  const [view, setView] = useState(null);
  const [activeLabel, setActiveLabel] = useState("");
  useEffect(() => {
    if (node?.data && toMarkdown(node.data.description)) {
      setView(node);
    } else {
      // whenever this condition is true, update the node to the parent node
      // any current node
      if (nodes) {
        const findParent = nodes.filter(
          (item) => item?.id == node?.data?.parent
        );
        setCurrentNode(findParent[0]);
      }
      if (activeLabel !== node?.data?.label) {
        setActiveLabel(node?.data?.label);
      }
    }
  }, [node]);

  if (view && Object.keys(view).length > 0) {
    const nodeData = view.data;
    const description = toMarkdown(nodeData.description);

    return (
      <div className="side-bar p-6">
        <h1 className="my-4 font-heading antialiased font-semibold tracking-heading text-gray-900 text-2xl">
          {nodeData.title}
        </h1>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            ...getMDXComponents,
            tr({ children }) {
              let title =
                children[0].props.children[
                  children[0].props.children.length - 1
                ];
                if (typeof title === "object") {
                  title = title.props.children[0];
                }
              const trimedTitle = title.trim()
              return (
                <tr
                  className={`${
                    activeLabel === trimedTitle
                      ? "bg-[#1b1130] [&>td]:text-white"
                      : "bg-white"
                  }`}
                  ref={ref}
                >
                  {children}
                </tr>
              );
            },
          }}
        >
          {description}
        </ReactMarkdown>
      </div>
    );
  }
  return (
    <div className="side-bar p-6">
      <h1 className="text-4xl">AsyncAPI Map</h1>
      <p>
        The AsyncAPI Map aims to help you find your way in the AsyncAPI
        Specification documentation. It has been created by{" "}
        <a href="https://twitter.com/_acebuild">Acethecreator</a>
      </p>
    </div>
  );
}

export default Sidebar;
