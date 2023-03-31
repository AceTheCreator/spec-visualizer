import generateDescription from "./generateDescription";

function removeByAttr(arr, attr, value) {
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
}

export function removeChildren(parentNode: any, nodes: any) {
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

export function retrieveObj(theObject: any, key: string) {
  var result = null;
  if (theObject instanceof Array) {
    for (var i = 0; i < theObject.length; i++) {
      result = retrieveObj(theObject[i], key);
      if (result) {
        break;
      }
    }
  } else {
    for (var prop in theObject) {
      if (prop == key) {
        return theObject[prop];
      }
      if (
        theObject[prop] instanceof Object ||
        theObject[prop] instanceof Array
      ) {
        result = retrieveObj(theObject[prop], key);
        if (result) {
          break;
        }
      }
    }
  }
  return result;
}

export function buildObjectDescriptionFromMd(key: string, version: string) {
  if (key) {
    const capitalized = key.charAt(0).toUpperCase() + key.slice(1);
    let newKeyName = `${capitalized} Object`;

    // They are some objects i couldn't retrieve programmatically so
    // i had to add them manually
    switch (key) {
      case "channels":
        newKeyName = "Channel Item Object";
        break;
      case "externalDocs":
        newKeyName = "External Documentation Object";
        break;
      case "tags":
        newKeyName = "Tag Object";
        break;
      case "schemas":
        newKeyName = "Schema Object";
        break;
      case "publish":
        newKeyName = "Operation Object";
        break;
      case "subscribe":
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
            // if (newKeyName === "Server Bindings Object") {
            //   console.log(description);
            // }
    return { title: newKeyName, description };
  }
}
