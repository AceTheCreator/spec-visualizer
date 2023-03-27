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

const versions: Array<string> = ["2.5.0", "2.6.0"];

async function startScript<T>(version:string): Promise<T> {
  const tree = await buildTree(version);
  return tree as T;
}

(async () => {
    versions.map(async(version) => {
          const trees = await startScript<TreeInterface>(version);
          writeFileSync(
            resolve(__dirname, `../configs`, `${version}.json`),
            JSON.stringify(trees)
          );
    })
})().catch((e) => {
  console.log(e);
});
