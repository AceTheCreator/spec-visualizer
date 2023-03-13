import toMarkdown from '@/utils/json-to-markdown';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import * as getMDXComponents from '../MDX';

function Sidebar({node}) {
  if (Object.keys(node).length) {
    const nodeData = node.data
    const description = toMarkdown(nodeData.description);
    return (
      <div className="side-bar p-6">
        <h1 className="my-4 font-heading antialiased font-semibold tracking-heading text-gray-900 text-2xl">
          {nodeData.label}
        </h1>
        {typeof nodeData.description === "string" ? (
          <div>{nodeData.description}</div>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            
            components={getMDXComponents}
          >
            {description}
          </ReactMarkdown>
        )}
      </div>
    );
  }
  return (
    <div className="side-bar p-6">
      <h1 className='text-4xl'>AsyncAPI Map</h1>
      <p>
        The AsyncAPI Map aims to help you find your way in the AsyncAPI
        Specification documentation. It has been created by{" "}
        <a href="https://twitter.com/_acebuild">Acethecreator</a>
      </p>
    </div>
  );
}

export default Sidebar