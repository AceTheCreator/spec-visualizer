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
  const properties = buildProperties(parent, parent.id);

  buildRoot(parent, parent.id, "children", properties);
}

function buildProperties(object: any, parent: number) {
  let newProperty: any = {};
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
    delete object.properties
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
    delete object.patternProperties;
  }
  if (object.additionalProperties && object.additionalProperties !== true) {
    const obj = object.additionalProperties;
    const arrayProps = obj.oneOf || obj.anyOf;
    if (arrayProps) {
      for (let i = 0; i < arrayProps.length; i++) {
        const newRef = arrayProps[i]["$ref"].split("/").slice(-1)[0];
        const title = newRef.split(".")[0];
        newProperty[title] = arrayProps[i];
      }
    }
    if (obj.type === "array" && obj.items) {
      const items = obj.items;
      newProperty[obj[Object.keys(items)[0]]] = Object.values(items)[0];
    } else {
      for (const property in obj) {
        if (typeof obj[property] === "string") {
          const data = retrieveObj(asyncapi, obj[property]);
          object = {
            ...object,
            ...data,
          }
          if (obj[property] === object["$id"]){
            delete object.additionalProperties;
          }
          const properties = buildProperties(object, object.id);
          buildRoot(object, object.id, "children", properties);
        } else {
          newProperty[property] = obj[property];
          newProperty[property].parent = parent;
          newProperty[property].name = property;
          newProperty[property].id = String(
            parseInt(Math.random(100000000) * 1000000)
          );
          newProperty[property].children = [];
        }
      }
    }
    if (newProperty.oneOf) {
      delete newProperty.oneOf;
    }
    delete object.additionalProperties
  }
  // if(!object.properties && !object.patternProperties && object.additionalProperties === true){
  //   console.log(object)
  // }
  return newProperty;
}

function buildRoot(object, parentId, type, properties) {
  if (type === "initial") {
    const properties = buildProperties(asyncapi, parentId);
    object[0].name = asyncapi.title;
    for (const property in properties) {
      if (properties[property].type === "array" && properties[property].items) {
        const items = properties[property].items;
        properties[property][Object.keys(items)[0]] = Object.values(items)[0];
        delete properties[property].items;
      }
      object[0].children.push({
        ...properties[property],
        parent: parentId,
        name: property,
        id: String(parseInt(Math.random(100000000) * 1000000)),
        children: [],
      });
    }
  } else {
    if (!object.children) {
      object["children"] = [];
    }
    for (const property in properties) {
      if (properties[property].type === "array" && properties[property].items) {
        const items = properties[property].items;
        properties[property][Object.keys(items)[0]] = Object.values(items)[0];
        delete properties[property].items;
      }
      object.children.push({
        ...properties[property],
        parent: parentId || object.id,
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
          buildChildrenFromRef(theObject, theObject[prop]);
        }
        if(key === "additionalProperties"){
          buildChildrenFromRef(theObject, theObject[prop]);
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
  getObject(tree, "additionalProperties");
  //  getObject(tree, "$ref");
  writeFileSync(
    resolve(__dirname, `../configs`, "2.5.0.json"),
    JSON.stringify(tree)
  );
}
