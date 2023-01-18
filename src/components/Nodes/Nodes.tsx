/* eslint-disable import/no-anonymous-default-export */
import React, { useCallback, useEffect, useRef } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";


const initialNodes = [
  {
    id: "1",
    name: "a",
    children: [
      {
        id: "2",
        name: "b",
        parent: "1",
        children: [
          {
            id: "3",
            name: "c",
            parent: "2",
            children: [
              {
                id: "4",
                parent: "3",
                name: "d",
              },
            ],
          },
        ],
      },
    ],
  },
];

const initialEdges = [
  {
    id: "edges-e5-7",
    source: "0",
    target: "1",
    label: "+",
    labelBgPadding: [8, 4],
    labelBgBorderRadius: 4,
    labelBgStyle: { fill: "#FFCC00", color: "#fff", fillOpacity: 0.7 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
];

let id = 1;
const getId = () => `${id++}`;

const fitViewOptions = {
  padding: 1,
};

const Nodes = (props: any) => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    setNodes([
      ...initialNodes.map((item) => {
        return {
          id: item.id,
          type: item?.children?.length ? "default" : "output",
          data: { label: item.name, children: item.children },
          position: { x: 0, y: 0 },
          sourcePosition: "right",
          targetPosition: "left",
        };
      }),
    ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNodeClick = (e, data) => {
    const findChildren = nodes.filter((item) => item?.data?.parent === data.id);
    if (!findChildren.length) {
      const itemChildren = [
        ...data.data.children.map((item, i) => {
          return {
            id: item.id,
            type: item?.children?.length ? "default" : "output",
            data: {
              label: item.name,
              children: item.children,
              parent: item.parent,
            },
            position: {
              x: data.position.x + 200,
              y: i === 0 ? data.position.y : data.position.y + i * 100,
            },
            sourcePosition: "right",
            targetPosition: "left",
          };
        }),
      ];
      setEdges([
        ...edges,
        ...itemChildren.map((item) => {
          return {
            id: String(parseInt(Math.random(100000000) * 1000000)),
            source: item?.data?.parent,
            target: item?.id,
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
          };
        }),
      ]);
      setNodes(nodes.concat(itemChildren));
    } else {
      setNodes([...nodes.filter((item) => item?.data?.parent !== data.id)]);
      setEdges([...edges.filter((item) => data.id !== item.source)]);
    }
  };

  return (
    <div
      className="wrapper"
      ref={reactFlowWrapper}
      style={{
        width: "100%",
        height: "100vh",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        fitView
        maxZoom={0.9}
        defaultViewport={{ x: 1, y: 1, zoom: 0.5 }}
        fitViewOptions={fitViewOptions}
      />
    </div>
  );
};

// eslint-disable-next-line react/display-name
export default () => (
  <ReactFlowProvider>
    <Nodes />
  </ReactFlowProvider>
);
