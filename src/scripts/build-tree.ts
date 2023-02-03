import fs, { writeFileSync, existsSync, readdirSync } from "fs";
import path, { resolve } from "path";

const res: any = [
  {
    id: "1",
    name: "asyncapi doc",
    children: [],
  },
];

const basePath = "src";
const specDirectories = [`${basePath}/data/2.5.0`];

async function walkDirectories(directories: string[]) {
  for (let dir of directories) {
    let files = readdirSync(dir);
    for (let file of files) {
      const filePath = [dir, file].join("/");
      const fileContent: any = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(fileContent);
    }
  }
}

function createSubTrees(parent: any, childPath: string) {
  const fileContent: any = fs.readFileSync(childPath, "utf-8");
  const data = JSON.parse(fileContent);
  parent = {
    ...parent,
    ...data,
  };
  let props = parent.properties;
  if (parent.additionalProperties) {
    const additionalProperties =
      parent.additionalProperties.oneOf || parent.additionalProperties.anyOf;
    const additionalProperty = parent.additionalProperties["$ref"];
    if (additionalProperties) {
      const newProps: any = {};
      for (let i = 0; i < additionalProperties.length; i++) {
        const newRef = additionalProperties[i]["$ref"].split("/").slice(-1)[0];
        const title = newRef.split(".")[0];
        newProps[title] = additionalProperties[i];
      //   const filePath = `src/data/2.5.0/${newRef}`;
      //   const fileContent: any = fs.readFileSync(filePath, "utf-8");
      //   const data = JSON.parse(fileContent);
      //   const properties = data.properties;
      //   for (const prop in properties) {
      //     if (properties[prop].type === "array" && properties[prop].items) {
      //       const items = properties[prop].items;
      //       properties[prop][Object.keys(items)[0]] = Object.values(items)[0];
      //       const ref = properties[prop]["$ref"];
      //       if (ref) {
      //       const newRef = ref
      //           .split("/")
      //           .slice(-1)[0];
      //       const filePath = `src/data/2.5.0/${newRef}`;
      //       const fileContent: any = fs.readFileSync(filePath, "utf-8");
      //       const data = JSON.parse(fileContent);
      //       properties[prop].properties = data.properties || data.additionalProperties;
      //     }
      //     delete properties[prop].items;
      //   }
      //   console.log(newProps[title]);
      // }
    }
      parent = {
        ...parent,
        properties: newProps,
      };
      props = parent.properties;
    }
    // if (additionalProperty) {
    //   const newRef = additionalProperty.split("/").slice(-1)[0];
    //   const filePath = `src/data/2.5.0/${newRef}`;
    //   const fileContent: any = fs.readFileSync(filePath, "utf-8");
    //   const data = JSON.parse(fileContent);
    //   parent = {
    //     ...parent,
    //     properties: data.properties,
    //   };
    //   props = parent.properties;
    // }
  }
  if (parent.children) {
    createChildren();
  } else {
    parent["children"] = [parent.properties] || [];
    createChildren();
  }
  delete parent["$ref"];
  delete parent.properties;
  function createChildren() {
    for (const prop in props) {
      parent.children.push({
        ...props[prop],
        parent: parent.id,
        name: prop,
        id: String(parseInt(Math.random(100000000) * 1000000)),
        children: [],
      });
    }
  }
}

function createInitalTree() {
  const filePath = "src/data/2.5.0/asyncapi.json";
  const fileContent: any = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(fileContent);
  for (const key in data) {
    if (data[key].type === "array" && data[key].items) {
      const items = data[key].items;
      data[key][Object.keys(items)[0]] = Object.values(items)[0];
      delete data[key].items;
    }
    res[0].children.push({
      ...data[key],
      parent: res[0].id,
      name: key,
      id: String(parseInt(Math.random(100000000) * 1000000)),
      children: [],
    });
  }
}

function getObject(theObject: any, key: string) {
  var result = null;
  if (theObject instanceof Array) {
    for (var i = 0; i < theObject.length; i++) {
      result = getObject(theObject[i], key);
      if (result) {
        break;
      }
    }
  } else {
    for (var prop in theObject) {
      if (prop == key) {
        if (key === "$ref") {
          const newRef = theObject[prop].split("/").slice(-1)[0];
          theObject[prop] = `src/data/2.5.0/${newRef}`;
          createSubTrees(theObject, theObject[prop]);
        }
        if (key === "additionalProperties") {
          createSubTrees(theObject, theObject[prop]["$ref"]);
        }
        if (theObject[prop] == 1) {
          return theObject;
        }
      }
      if (
        theObject[prop] instanceof Object ||
        theObject[prop] instanceof Array
      ) {
        result = getObject(theObject[prop], key);
        if (result) {
          break;
        }
      }
    }
  }
  return result;
}

export default async function buildTree() {
  createInitalTree();
  getObject(res, "$ref");
  getObject(res, "additionalProperties");

  await walkDirectories(specDirectories);
  writeFileSync(
    resolve(__dirname, `../configs`, "2.5.0.json"),
    JSON.stringify(res)
  );
}
