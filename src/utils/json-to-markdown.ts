import traverse from "traverse";

export default function toMarkdown(jsonObject: object) {
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

function getHash(level: number) {
  var hash = "";
  for (var i = 0; i < level; i++) {
    hash += "#";
  }
  return hash;
}
