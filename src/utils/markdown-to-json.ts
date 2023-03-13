import fs from 'fs';
import marked from 'marked';

export default function parse (mdContent: string) {
  const aligned = getAlignedContent(mdContent);
  const json = marked.lexer(aligned);
  let currentHeading,
    headings = [];
  const output = json.reduce(function (result, item) {
    if (!currentHeading) {
      currentHeading = result;
    }
    if (item.type == "heading") {
      if (!currentHeading || item.depth == 1) {
        headings = [];
        result[item.text] = {};
        currentHeading = result[item.text];
        headings.push(item.text);
      } else {
        const parentHeading = getParentHeading(headings, item, result);
        headings = parentHeading.headings;
        if (!parentHeading.parent) {
          for (let i = 0; i < headings.length; i++) {
            const head = headings[i];
            if (head === item.text) {
              currentHeading["failedParent"] = true;
            }
          }
        } else {
          currentHeading = parentHeading.parent;
        }
        currentHeading[item.text] = {};
        currentHeading = currentHeading[item.text];
      }
    } else {
      currentHeading.raw = currentHeading.raw
        ? currentHeading.raw + item.raw
        : item.raw;
    }
    return result;
  }, {});
  return output;
};

function getAlignedContent(mdContent) {
  const headings = mdContent.match(/(?:\r\n)#.*$/gm);
  if (!headings) {
    return mdContent.trim();
  }
  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i].trim();
    const propHeading = new RegExp("(?:\r\n){2}" + heading + ".*$", "mg");
    if (!mdContent.match(propHeading)) {
      const wrongHeading = new RegExp("(?:\r\n)" + heading + ".*$", "mg");
      mdContent = mdContent.replace(wrongHeading, "\r\n\r\n" + heading);
    }
  }
  return mdContent;
}

function getParentHeading(headings, item, result) {
  let parent,
    index = item.depth - 1;
  const currentHeading = headings[index];
  if (currentHeading) {
    headings.splice(index, headings.length - index);
  }
  const replaceHeadWithAnchorTag = item.text;
  item.text = replaceHeadWithAnchorTag.replace(/<\/?a[^>]*>/g, "");
  headings.push(item.text);
  for (let i = 0; i < index; i++) {
    parent = !parent ? result[headings[i]] : parent[headings[i]];
  }
  return {
    headings: headings,
    parent: parent,
  };
}