interface TreeInterface {
  id: number;
  name: string;
  parent: number;
  description: string;
  children: Array<TreeInterface>;
  "$ref"?: string,
  title: string
};

import buildTree from './build-tree.js';

async function startScript<T>(): Promise<T> {
    const tree = await buildTree()
    return tree as T;
}

const trees = await startScript<TreeInterface>()

console.log(trees)