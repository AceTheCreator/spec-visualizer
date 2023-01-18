import buildSpec from './build-specs.js';
import buildTree from './build-tree.js';

async function start(){
    await buildSpec();
    await buildTree()
}

start()