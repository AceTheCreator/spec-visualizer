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
      const fileName =
        file.split(".")[0].charAt(0).toLowerCase() +
        file.split(".")[0].slice(1);
      const filePath = [dir, file].join("/");
      const fileContent: any = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(fileContent);
      // console.log(filePath)
      // if(!data.parent){
      //     console.log('ok')
      //     data.parent = 'asyncapi'
      // }
      // constructParentarray(fileName, data.properties)
    }
  }
}

function createSubTrees(parent: any, childPath: string) {
  const fileContent: any = fs.readFileSync(childPath, "utf-8");
  const data = JSON.parse(fileContent);
  if(parent.properties){
    console.log(true);
  }else{
    console.log(parent)
  }
  parent = {
    ...parent,
    ...data,
  };
  delete parent["$ref"];
  let props = parent.properties;
  if(parent.additionalProperties){
    const newProperties = parent.additionalProperties.oneOf;

    
  }
  if (parent.children) {
    createChildren()
  } else {
    parent["children"] = [parent.properties];
    createChildren();
  }
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
    res[0].children.push({
      ...data[key],
      parent: res[0].id,
      name: key,
      id: String(parseInt(Math.random(100000000) * 1000000)),
      children: [],
    });
  }
}

function getObject(theObject: any) {
  var result = null;
  if (theObject instanceof Array) {
    for (var i = 0; i < theObject.length; i++) {
      result = getObject(theObject[i]);
      if (result) {
        break;
      }
    }
  } else {
    for (var prop in theObject) {
      if (prop == "$ref") {
        const newRef = theObject[prop].split("/").slice(-1)[0];
        theObject[prop] = `src/data/2.5.0/${newRef}`;
        createSubTrees(theObject, theObject[prop]);
        // console.log(theObject[prop]);
        if (theObject[prop] == 1) {
          return theObject;
        }
      }
      if (
        theObject[prop] instanceof Object ||
        theObject[prop] instanceof Array
      ) {
        result = getObject(theObject[prop]);
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
  const result = getObject(res);

  //   console.log(result)

  await walkDirectories(specDirectories);
  // console.log(res)
  writeFileSync(
    resolve(__dirname, `../configs`, "2.5.0.json"),
    JSON.stringify(res)
  );
}
