import { writeFileSync } from "fs";
import { resolve } from "path";
import buildTree from "./build-tree.js";
import versions from '../configs/specVersions.json';
// interface TreeInterface {
//   id: number;
//   name: string;
//   parent: number;
//   description: string;
//   children: Array<TreeInterface>;
//   $ref?: string;
//   title: string;
// }

function startScript(version: string) {
  const tree = buildTree(version);
  return tree;
}

(async () => {
  versions.map(async (version) => {
    const trees = startScript(version);
    return writeFileSync(
      resolve(__dirname, `../configs`, `${version}.json`),
      JSON.stringify(trees)
    );
  });
})().catch((e) => {
  console.log(e);
});
