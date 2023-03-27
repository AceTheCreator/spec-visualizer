import { writeFileSync } from "fs";
import { resolve } from "path";
import buildTree from "./build-tree.js";
interface TreeInterface {
  id: number;
  name: string;
  parent: number;
  description: string;
  children: Array<TreeInterface>;
  $ref?: string;
  title: string;
}

async function startScript<T>(): Promise<T> {
  const tree = await buildTree();
  return tree as T;
}

(async () => {
  const trees = await startScript<TreeInterface>();
    writeFileSync(
      resolve(__dirname, `../configs`, "2.5.0.json"),
      JSON.stringify(trees)
    );
})().catch((e) => {
  console.log(e);
});
