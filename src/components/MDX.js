import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const H1 = ({ children }) => {
  return (
    <h1 className="my-4 font-heading antialiased font-semibold tracking-heading text-gray-900 text-2xl">
      {children}
    </h1>
  );
};

const H2 = ({ children }) => {
  return (
    <h2 className="mb-4 mt-6 font-heading antialiased font-semibold tracking-heading text-gray-900 text-2xl">
      {children}
    </h2>
  );
};

const H3 = ({ children }) => {
  return (
    <h3 className="mb-4 mt-6 font-heading antialiased font-medium tracking-heading text-gray-900 text-lg">
      {children}
    </h3>
  );
};
const H4 = ({ children }) => {
  return (
    <h4 className="my-4 font-heading antialiased font-medium text-md text-gray-900">
      {children}
    </h4>
  );
};

const H5 = ({ children }) => {
  return (
    <h5 className="my-4 font-heading antialiased text-md font-bold">
      {children}
    </h5>
  );
};

const H6 = ({ children }) => {
  return (
    <h6 className="my-4 font-heading antialiased text-sm font-bold text-gray-900 uppercase">
      {children}
    </h6>
  );
};

const Paragraph = ({ children }) => {
  return (
    <p className=" my-4 text-gray-700 font-regular font-body antialiased">
      {children}
    </p>
  );
};

const TableComponent = ({ children, ...props }) => {
    console.log(props)
  return (
    <div className="flex flex-col">
      <div className="">
        <div className="align-middle inline-block w-full shadow overflow-auto sm:rounded-lg border-b border-gray-200">
          <table className="table-fixed">{children}</table>
        </div>
      </div>
    </div>
  );
};

const TableHead = ({ children }) => {
  return (
    <th
      className={`px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs leading-4 font-medium font-body text-gray-900 uppercase tracking-wider`}
    >
      {children}
    </th>
  );
};

const TableRow = ({ children }) => {
  return <tr className={`bg-white`}>{children}</tr>;
};

const TableDirection = ({ children }) => {
  return (
    <td
      className={`px-6 py-4 border-b border-gray-200 text-sm leading-5 text-gray-700 tracking-tight`}
    >
      {children}
    </td>
  );
};

const CodeComponent = ({ children, inline, props, className="" }) => {
const match = /language-(\w+)/.exec(className || "");
return !inline && match ? (
  <SyntaxHighlighter
    language={match[1]}
    PreTag="section"
    // style={coldarkDark}
    showLineNumbers={true}
    {...props}
  >
    {String(children).replace(/\n$/, "")}
  </SyntaxHighlighter>
) : (
  <code className={className} {...props}>
    {children}
  </code>
);
}

export const table = TableComponent;
export const th = TableHead;
export const tr = TableRow;
export const td = TableDirection;
export const h1 = H1;
export const h2 = H2;
export const h3 = H3;
export const h4 = H4;
export const h5 = H5;
export const h6 = H6;
export const p = Paragraph;
export const code = CodeComponent;
