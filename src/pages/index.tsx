import Nodes from "../components/Nodes/Nodes";
// const useCenteredTree = (defaultTranslate = { x: 0, y: 0 }) => {
//   const [translate, setTranslate] = useState(defaultTranslate);
//   const [dimensions, setDimensions] = useState();
//   const containerRef = useCallback((containerElem) => {
//     if (containerElem !== null) {
//       const { width, height } = containerElem.getBoundingClientRect();
//       setDimensions({ width, height });
//       setTranslate({ x: width / 2, y: height / 2 });
//     }
//   }, []);
//   return [dimensions, translate, containerRef];
// };

export default function Home() {
  return (
    <Nodes />
  );
}
