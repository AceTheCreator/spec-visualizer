/* eslint-disable import/no-anonymous-default-export */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { SmartBezierEdge } from "@tisoap/react-flow-smart-edge";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  MarkerType,
  useReactFlow,
  ConnectionLineType,
  Edge,
  Node,
  Connection,
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";
import version25 from "../../configs/2.5.0.json";
import version26 from "../../configs/2.6.0.json";
import { removeChildren } from "@/utils/simpleReuse";

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

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes: any, edges: any, direction = "TB") => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node: any) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge: any) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node: any) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? "left" : "top";
    node.sourcePosition = isHorizontal ? "right" : "bottom";

    node.position = {
      x: nodeWithPosition.x - nodeWidth / 3,
      y: nodeWithPosition.y - nodeHeight / 3,
    };
    return node;
  });

  return { nodes, edges };
};

const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
  version25,
  initialEdges
);


type MyObject = { [x: string]: any };

type NodeProps = {
  setCurrentNode: (node: Node) => void;
  passNodes: (node: typeof layoutedNodes) => void;
};

const Nodes = ({ setCurrentNode, passNodes }: NodeProps ) => {
  const router = useRouter();
  const [version, setVersion] = useState(
    router?.query?.version ? router.query.version : "2.5.0"
  );
  let initialNodes: MyObject = version25;
  // const [initialNodes, setInitialNodes] = useState<MyObject>(version === "2.5.0" ? version25 : version26)
  const reactFlowWrapper = useRef(null);
  const { setCenter } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>(layoutedEdges);

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: ConnectionLineType.SmoothStep,
            animated: true,
          },
          eds
        )
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const focusNode = (x: number, y: number, zoom: number) => {
    setCenter(x, y, { zoom, duration: 1000 });
  };

  useEffect(() => {
    if (version === "2.6.0") {
      initialNodes = version26;
    }
    setNodes([
      ...initialNodes.map((item: MyObject) => {
        return {
          id: item.id,
          type: item?.children?.length ? "default" : "output",
          data: {
            label: item.name,
            children: item.children,
            description: item.description,
            title: item.title,
          },
          position: { x: 0, y: 0 },
          sourcePosition: "right",
          targetPosition: "left",
        };
      }),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);

  useEffect(() => {
    if (router?.query?.version) {
      setVersion(router.query.version);
    }
  }, [router.query]);

  const handleNodeClick = (e, data: MyObject) => {
    const findChildren = nodes.filter((item) => item?.data?.parent === data.id);
    if (!findChildren.length) {
      const itemChildren = [
        ...data.data.children.map((item: MyObject) => {
          return {
            id: item.id,
            type: item?.children?.length ? "default" : "output",
            data: {
              label: item.name,
              children: item.children,
              parent: item.parent,
              description: item.description,
              title: item.title,
            },
            sourcePosition: "right",
            targetPosition: "left",
            draggable: false,
          };
        }),
      ];
      const newEdges = [
        ...edges,
        ...itemChildren.map((item) => {
          return {
            id: String(Math.floor(Math.random() * 1000000)),
            source: item?.data?.parent,
            target: item?.id,
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
          };
        }),
      ];
      const newNodes = nodes.concat(itemChildren);
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(newNodes, newEdges, "LR");
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
      if (itemChildren.length) {
        focusNode(itemChildren[3].position.x, itemChildren[3].position.y, 0.9);
      }
    } else {
      const newNodes = removeChildren(data.data, nodes);
      setNodes([...newNodes]);
      setEdges([...edges.filter((item) => data.id !== item.source)]);
    }
  };
  function handleMouseEnter(e, data: Node) {
    setCurrentNode(data);
    passNodes(nodes);
  }
  const edgeTypes = {
    smart: SmartBezierEdge,
  };
  return (
    <div
      className="wrapper"
      ref={reactFlowWrapper}
      style={{
        width: "100%",
        height: "95vh",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        connectionLineType={ConnectionLineType.SmoothStep}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onNodeMouseEnter={handleMouseEnter}
        fitView
        defaultViewport={{ x: 1, y: 1, zoom: 0.9 }}
      />
    </div>
  );
};

// eslint-disable-next-line react/display-name
export default ({ setCurrentNode, passNodes }: NodeProps) => (
  <ReactFlowProvider>
    <Nodes setCurrentNode={setCurrentNode} passNodes={passNodes} />
  </ReactFlowProvider>
);
