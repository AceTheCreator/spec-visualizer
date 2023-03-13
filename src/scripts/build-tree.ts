import generateDescription from "@/utils/generateDescription";
import { retrieveObj } from "@/utils/simpleReuse";
import { writeFileSync } from "fs";
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

function extractProps(object, newProperty, parent) {
  const obj = object.properties;
  for (const property in obj) {
    // TODO: Restructure for message properties
    if (obj[property].oneOf) {
      obj[property].additionalProperties = {
        oneOf: obj[property].oneOf,
      };
      const newPatterns = obj[property];
      const props = buildProperties(newPatterns, newPatterns.id);
      buildRoot(newPatterns, newPatterns.id, "children", props);
    }
    newProperty[property] = obj[property];
    newProperty[property].parent = parent;
    newProperty[property].name = property;
    newProperty[property].id = String(
      parseInt(Math.random(100000000) * 1000000)
    );
    newProperty[property].children = [];
    if (obj[property].patternProperties) {
      const patterns = obj[property];
      const props = buildProperties(patterns, patterns.id);
      buildRoot(patterns, patterns.id, "children", props);
      newProperty[property] = patterns;
    }
  }
}

function extractPatternProps(object, newProperty, parent) {
  const obj = object.patternProperties;
  if (obj[Object.keys(obj)[0]] && obj[Object.keys(obj)[0]].oneOf) {
    const arrayProps = obj[Object.keys(obj)[0]].oneOf;
    for (let i = 0; i < arrayProps.length; i++) {
      const newRef = arrayProps[i]["$ref"].split("/").slice(-1)[0];
      const title = newRef.split(".")[0];
      newProperty[title] = arrayProps[i];
    }
    delete obj[Object.keys(obj)[0]];
  }
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

function extractAdditionalProps(object, newProperty, parent) {
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
        };
        if (obj[property] === object["$id"]) {
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
}

function extractArrayProps(object, newProperty, parent) {
  if (object.anyOf || object.allOf || object.oneOf) {
    const oneOfProperty = object.allOf || object.oneOf;
    if (oneOfProperty) {
      for (let i = 0; i < oneOfProperty.length; i++) {
        if (oneOfProperty[i]["$ref"]) {
          const newRef = oneOfProperty[i]["$ref"].split("/").slice(-1)[0];
          const title = newRef.split(".")[0];
          newProperty[title] = oneOfProperty[i];
          newProperty[title].parent = parent;
          newProperty[title].name = title;
          newProperty[title].id = String(
            parseInt(Math.random(100000000) * 1000000)
          );
          newProperty[title].children = [];
        } else {
          const children = oneOfProperty[i];
          const patterns = children.patternProperties;
          const properties = children.properties;
          if (patterns) {
            for (const property in patterns) {
              newProperty[property] = patterns[property];
              newProperty[property].id = String(
                parseInt(Math.random(100000000) * 1000000)
              );
              newProperty[property].name = property;
              newProperty[property].parent = object.id;
            }
          }
          if (properties) {
            for (const property in properties) {
              if (properties[property]["$ref"] === object["$id"]) {
                delete properties[property]["$ref"];
              }
              if (
                properties[property].additionalProperties &&
                properties[property].additionalProperties["$ref"] ===
                  object["$id"]
              ) {
                delete properties[property].additionalProperties;
              }
              newProperty[property] = properties[property];
              newProperty[property].id = String(
                parseInt(Math.random(100000000) * 1000000)
              );
              newProperty[property].name = property;
              newProperty[property].parent = object.id;
            }
          }
        }
      }
      delete object.allOf;
    }
  }
}

function buildProperties(object: any, parent: number) {
  let newProperty: any = {};
  if (object.properties) {
    extractProps(object, newProperty, parent);
    delete object.properties;
  }
  if (object.patternProperties) {
    extractPatternProps(object, newProperty, parent);
    delete object.patternProperties;
  }
  if (object.additionalProperties && object.additionalProperties !== true) {
    extractAdditionalProps(object, newProperty, parent);
    delete object.additionalProperties;
  }
  if (
    !object.properties &&
    !object.patternProperties &&
    !object.additionalProperties
  ) {
    extractArrayProps(object, newProperty, parent);
  }
  return newProperty;
}

function buildObjectDescriptionFromMd(key:string){
if(key){
  const capitalized = key.charAt(0).toUpperCase() + key.slice(1);
  const newKeyName = `${capitalized} Object`
  const description = generateDescription(newKeyName);
  return description;
}
}

function buildRoot(object, parentId, type, properties) {
  if (type === "initial") {
    const properties = buildProperties(asyncapi, parentId);
    object[0].name = asyncapi.title;
      const description = generateDescription("AsyncAPI Object");
      object[0].description = description
      // console.log(object)
    for (const property in properties) {
      if (properties[property].type === "array" && properties[property].items) {
        const items = properties[property].items;
        properties[property][Object.keys(items)[0]] = Object.values(items)[0];
        delete properties[property].items;
      }
      const buildDescription = buildObjectDescriptionFromMd(property);
      object[0].children.push({
        ...properties[property],
        parent: parentId,
        name: property,
        description: buildDescription || properties[property].description,
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
      const buildDescription = buildObjectDescriptionFromMd(property);
      object.children.push({
        ...properties[property],
        parent: parentId || object.id,
        name: property,
        description: buildDescription || properties[property].description,
        id:
          properties[property].id ||
          String(parseInt(Math.random(100000000) * 1000000)),
        children: properties[property].children || [],
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
        if (key === "additionalProperties") {
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
  buildRoot(tree, 1, "initial", null);
  getObject(tree, "$ref");
  getObject(tree, "additionalProperties");
  writeFileSync(
    resolve(__dirname, `../configs`, "2.5.0.json"),
    JSON.stringify(tree)
  );
}
