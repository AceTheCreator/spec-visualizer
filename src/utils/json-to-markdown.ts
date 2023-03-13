import traverse from "traverse";

export default function toMarkdown(jsonObject) {
  var mdText = "";
  traverse(jsonObject).reduce(function (acc, value) {
    mdText +=
      this.isLeaf && this.key === "raw"
        ? value
        : getHash(this.level) + " " + this.key + "\n\n";
    return;
  });
  return mdText;
}

function getHash(level) {
  var hash = "";
  for (var i = 0; i < level; i++) {
    hash += "#";
  }
  return hash;
}
