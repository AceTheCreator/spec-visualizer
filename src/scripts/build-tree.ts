import generateDescription from "@/utils/generateDescription";
import { retrieveObj } from "@/utils/simpleReuse";
import versions from "@asyncapi/specs";

let asyncapi: MyObject = {};
let specVersion: string = "";

type TreeInterface = {
  id: number;
  name: string;
  parent: number;
  description: string;
  children: Array<TreeInterface>;
  $ref?: string;
  title: string;
};

type MyObject = { [x: string]: any };

interface PropertiesInterface extends TreeInterface {
  properties?: MyObject;
  additionalProperties?: PropertiesInterface | MyObject | boolean;
  patternProperties?: MyObject;
  $id?: string;
  allOf?: Array<TreeInterface>;
  anyOf?: Array<TreeInterface>;
  oneOf?: Array<TreeInterface>;
}

const tree: Array<TreeInterface> = [
  {
    id: 1,
    name: "",
    parent: 0,
    description: "",
    children: [],
    title: "",
    $ref: "",
  },
];

function buildFromChildren(object: TreeInterface) {
  if (object["$ref"]) {
    const data = retrieveObj(asyncapi, object["$ref"]);
    object = {
      ...object,
      ...data,
    };
  }
  const properties = buildProperties(object, object.id);
  buildRoot(object, object.id, "children", properties);
}

function extractProps(
  object: PropertiesInterface,
  newProperty: MyObject,
  parent: number
) {
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
    if (typeof obj[property] === "object") {
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
}

function extractPatternProps(
  object: PropertiesInterface,
  newProperty: MyObject,
  parent: number
) {
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
    if (typeof obj[property] === "object") {
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

function extractAdditionalProps(
  object: PropertiesInterface,
  newProperty: MyObject,
  parent: number
) {
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
        if (object.oneOf || object.allOf) {
          extractArrayProps(object, newProperty, parent);
        }
        if (object.properties) {
          const newProps = object.properties;
          for (const a in newProps) {
            newProperty[a] = newProps[a];
            newProperty[a].parent = parent;
            newProperty[a].name = a;
            newProperty[a].id = String(
              parseInt(Math.random(100000000) * 1000000)
            );
            newProperty[a].children = [];
          }
        }
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

function extractArrayProps(
  object: PropertiesInterface,
  newProperty: MyObject,
  parent: number
) {
  if (object.anyOf || object.allOf || object.oneOf) {
    const arrayOfProps = object.allOf || object.oneOf;
    if (arrayOfProps) {
      for (let i = 0; i < arrayOfProps.length; i++) {
        if (arrayOfProps[i]["$ref"]) {
          const newRef = arrayOfProps[i]["$ref"].split("/").slice(-1)[0];
          const title = newRef.split(".")[0];
          newProperty[title] = arrayOfProps[i];
          newProperty[title].parent = parent;
          newProperty[title].name = title;
          newProperty[title].id = String(
            parseInt(Math.random(100000000) * 1000000)
          );
          newProperty[title].children = [];
        } else {
          const children = arrayOfProps[i];
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
          if (object.name === "messages") {
            const title = "message";
            newProperty[title] = children.oneOf[1];
            newProperty[title].parent = parent;
            newProperty[title].name = title;
            newProperty[title].id = String(
              parseInt(Math.random(100000000) * 1000000)
            );
            newProperty[title].children = [];
          }
        }
      }
      delete object.allOf;
    }
  }
}

function buildProperties(object: PropertiesInterface, parent: number) {
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

function buildObjectDescriptionFromMd(key: string, version: string) {
  if (key) {
    const capitalized = key.charAt(0).toUpperCase() + key.slice(1);
    let newKeyName = `${capitalized} Object`;

    // They are some objects i couldn't retrieve programmatically so
    // i had to add them manually
    switch (key) {
      case "externalDocs":
        newKeyName = "External Documentation Object";
        break;
      case "tags":
        newKeyName = "Tag Object";
        break;
      case "schemas":
        newKeyName = "Schema Object";
        break;
      case "publish" || "subscribe":
        newKeyName = "Operation Object";
        break;
      case "operationBindings":
        newKeyName = "Operation Bindings Object";
        break;
      case "operationTraits":
        newKeyName = "Operation Trait Object";
        break;
      case "security":
        newKeyName = "Security Requirement Object";
        break;
      case "SecurityScheme":
        newKeyName = "Security Scheme Object";
        break;
      case "serverVariable":
        newKeyName = "Server Variable Object";
        break;
      case "messageBindings":
        newKeyName = "Message Bindings Object";
        break;
      case "serverBindings":
        newKeyName = "Server Bindings Object";
        break;
      case "channelBindings":
        newKeyName = "Channel Bindings Object";
        break;
      case "correlationIds":
        newKeyName = "Correlation ID Object";
        break;
      case "messageTraits":
        newKeyName = "Message Trait Object";
        break;
      default:
        break;
    }

    const description = generateDescription(newKeyName, version);
    return { title: newKeyName, description };
  }
}

function buildRoot(
  object: TreeInterface,
  parentId: number,
  type: string,
  properties: MyObject
) {
  if (type === "initial") {
    const properties = buildProperties(asyncapi, parentId);
    object.name = asyncapi.title;
    const description = generateDescription("AsyncAPI Object", specVersion);
    object.description = description;
    object.title = "AsyncAPI Object";
    for (const property in properties) {
      if (properties[property].type === "array" && properties[property].items) {
        const items = properties[property].items;
        properties[property][Object.keys(items)[0]] = Object.values(items)[0];
        delete properties[property].items;
      }
      const buildDescription = buildObjectDescriptionFromMd(
        property,
        specVersion
      );
      object.children.push({
        ...properties[property],
        parent: parentId,
        name: property,
        title: buildDescription?.title,
        description:
          buildDescription?.description || properties[property].description,
        id: String(parseInt(Math.random(100000000) * 1000000)),
        children: [],
      });
    }
    const objChildren = object.children;
    for (let i = 0; i < objChildren.length; i++) {
      buildFromChildren(objChildren[i]);
    }
  } else {
    if (!object.children) {
      object["children"] = [];
    }
    if (object.children.length <= 0) {
      for (const property in properties) {
        if (
          properties[property].type === "array" &&
          properties[property].items
        ) {
          const items = properties[property].items;
          properties[property][Object.keys(items)[0]] = Object.values(items)[0];
          delete properties[property].items;
        }
        const buildDescription = buildObjectDescriptionFromMd(
          property,
          specVersion
        );
        object.children.push({
          ...properties[property],
          parent: parentId || object.id,
          name: property,
          title: buildDescription?.title,
          description:
            buildDescription?.description || properties[property].description,
          id:
            properties[property].id ||
            String(parseInt(Math.random(100000000) * 1000000)),
          children: properties[property].children || [],
        });
      }
    }
    const objChildren = object.children;
    for (let i = 0; i < objChildren.length; i++) {
      if (objChildren[i].children.length <= 0) {
        buildFromChildren(objChildren[i]);
      }
    }
  }
}

export default function buildTree(version: string) {
  asyncapi = versions[version];
  specVersion = version;
  buildRoot(tree[0], 1, "initial", null);
  return tree;
}
