import toMarkdown from "@/utils/json-to-markdown";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import * as getMDXComponents from "../MDX";

function Sidebar({ node, nodes, setCurrentNode }) {
  const ref = useRef(null);
  const [view, setView] = useState(null);
  const [activeLabel, setActiveLabel] = useState("");
  useEffect(() => {
    console.log(node)
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
              const trimedTitle = title.trim();
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
    <div className="side-bar relative">
      <div className="p-6">
        <h1 className="text-3xl font-bold">AsyncAPI Spec Visualizer</h1>
        <p className="mt-6">
          The AsyncAPI specification visualizer helps you learn and navigate the
          different components that makes up the AsyncAPI specification in an
          interactive way.
        </p>
        <div className="mt-6 bg-green-100 p-4 rounded-lg">
          This tool currently shows the 2.5.0 and the 2.6.0 of the AsyncAPI
          specification. You can select the version by using the dropdown at the
          top left of the screen or also use direct link
          <div className="text-blue-500 underline mt-2">
            <Link href="/?version=2.5.0">version 2.5.0</Link>
            <br />
            <Link href="/?version=2.6.0">version 2.6.0</Link>
          </div>
        </div>
      </div>
      <div className="p-4 absolute bg-red-400 w-full bottom-0 text-xl">
        Note: This is still a work in progress...
      </div>
    </div>
  );
}

export default Sidebar;
