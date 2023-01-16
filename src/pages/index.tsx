import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import Tree from "react-d3-tree";
import { useCenteredTree } from "../utils/helpers";

const containerStyles = {
  width: "100vw",
  height: "100vh",
};


const orgChart = {
  name: "CEO",
  children: [
    {
      name: "Manager",
      attributes: {
        department: "Production",
      },
      children: [
        {
          name: "Foreman",
          attributes: {
            department: "Fabrication",
          },
          children: [
            {
              name: "Worker",
            },
          ],
        },
        {
          name: "Foreman",
          attributes: {
            department: "Assembly",
          },
          children: [
            {
              name: "Worker",
            },
          ],
        },
      ],
    },
  ],
};

 // Here we're using `renderCustomNodeElement` to represent each node
// as an SVG `rect` instead of the default `circle`.
const renderRectSvgNode = ({ nodeDatum, toggleNode }) => (
  <g>
    <rect width="60" height="50" x="-10" onClick={toggleNode} />
    <text fill="black" strokeWidth="1" x="20">
      {nodeDatum.name}
    </text>
    {nodeDatum.attributes?.department && (
      <text fill="black" x="20" dy="20" strokeWidth="1">
        Department: {nodeDatum.attributes?.department}
      </text>
    )}
  </g>
);


export default function Home() {
    const [dimensions, translate, containerRef] = useCenteredTree();
  return (
    <div style={containerStyles} ref={containerRef}>
      <Tree
        data={orgChart}
        dimensions={dimensions}
        translate={translate}
        renderCustomNodeElement={renderRectSvgNode}
        orientation="vertical"
      />
    </div>
  );
}
