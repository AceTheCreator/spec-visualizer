function removeByAttr (arr, attr, value) {
  var i = arr.length;
  while (i--) {
    if (
      arr[i] &&
      arr[i].hasOwnProperty(attr) &&
      arguments.length > 2 &&
      arr[i][attr] === value
    ) {
      arr.splice(i, 1);
    }
  }
  return arr;
};

export default function removeChildren(parentNode: any, nodes: any) {
  let newNodes = nodes;
  const children = parentNode.children;
  if (children.length > 0) {
    for (let i = 0; i < children.length; i++) {
      newNodes = removeByAttr(nodes, "id", children[i].id);
      if (children[i].children.length > 0) {
        removeChildren(children[i], newNodes);
      }
    }
  }
  return newNodes;
}
