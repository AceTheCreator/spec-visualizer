export type NodeType = {
  id: string;
  name: string;
  parent: number;
  description: string;
  children: Array<Node>;
  $ref?: string;
  title: string;
  targetPosition?: string;
  sourcePosition?: string;
  position?: object;
};

export type EdgeType = {
  id: string;
  source: string;
  target: string;
  label: string;
  labelBgPadding: number[];
  labelBgBorderRadius: number;
  labelBgStyle: object;
  markerEnd: object;
};