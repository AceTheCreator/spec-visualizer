import { retrieveObj } from "@/utils/simpleReuse";
import fs, { writeFileSync, existsSync, readdirSync } from "fs";
import path, { resolve } from "path";
import asyncapi from "../data/2.5.0/asyncapi.json";

type TreeInterface = {
  id: number;
  name: string;
  parent: number;
  description: string;
  children: Array<TreeInterface>;
};

const tree: Array<TreeInterface> = [
  {
    id: 1,
    children: [],
  },
];

function buildChildrenFromRef(parent, key) {
  const data = retrieveObj(asyncapi, key);
  parent = {
    ...parent,
    ...data,
  };
  console.log(parent)
    const properties = buildProperties(parent, parent.id);
    // console.log(properties);
  // buildRoot(parent, parent.id, "children");
}

function buildProperties(object: any, parent: number) {
  const newProperty: any = {};
  if (object.properties) {
    const obj = object.properties;
    for (const property in obj) {
      newProperty[property] = obj[property];
      newProperty[property].parent = parent;
      newProperty[property].name = property;
      newProperty[property].id = String(
        parseInt(Math.random(100000000) * 1000000)
      );
      newProperty[property].children = [];
    }
  }
  if (object.patternProperties) {
    const obj = object.patternProperties;
    for (const property in obj) {
      newProperty[property] = obj[property];
      newProperty[property].parent = parent;
      newProperty[property].name = property;
      newProperty[property].id = String(
        parseInt(Math.random(100000000) * 1000000)
      );
      newProperty[property].children = [];
    }
  }
  if (object.additionalProperties) {
    const obj = object.additionalProperties;
    for (const property in obj) {
      newProperty[property] = obj[property];
      newProperty[property].parent = parent;
      newProperty[property].name = property;
      newProperty[property].id = String(
        parseInt(Math.random(100000000) * 1000000)
      );
      newProperty[property].children = [];
    }
  }
  return newProperty;
}

function buildRoot(object, parentId, type) {
  const properties = buildProperties(asyncapi, parentId);
  if(type === "initial"){
      object[0].name = asyncapi.title;
      for (const property in properties) {
        object[0].children.push({
          ...properties[property],
          parent: parentId,
          name: property,
          id: String(parseInt(Math.random(100000000) * 1000000)),
          children: [],
        });
      }
  }else{
      for (const property in properties) {
        object.children.push({
          ...properties[property],
          parent: parentId,
          name: property,
          id: String(parseInt(Math.random(100000000) * 1000000)),
          children: [],
        });
      }
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
          buildChildrenFromRef(theObject, theObject[prop] )
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
  buildRoot(tree, 1, "initial");
  getObject(tree, "$ref");
  writeFileSync(
    resolve(__dirname, `../configs`, "2.5.0.json"),
    JSON.stringify(tree)
  );
}
