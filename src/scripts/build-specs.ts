import fs, { writeFileSync, existsSync } from "fs";
import path, { resolve } from "path";
import fetch from "node-fetch";
import parse from "@/utils/markdown-to-json";

async function createDir(name: string){
  if(!existsSync(`src/data/${name}`)){
      fs.mkdir(path.join("src/data", name), (err) => {
        if (err) {
          return console.error(err);
        }
      });
  }
}

async function createFile(dir: string, name: string, data: string){
  writeFileSync(
    resolve(__dirname, `../data/${dir}`, name),
    data
  );
}

export default async function buildSpecs() {
  try {
    let res = await fetch("http://asyncapi.com/definitions/2.5.0.json", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const spec: any = await res.json();
    const properties = spec.properties;
    const definitions = spec.definitions;
    const specVersion = properties.asyncapi.enum[0];     
    if(properties){
      // create spec directory
      await createDir(specVersion)
      await createFile(specVersion, 'asyncapi.json', JSON.stringify(spec));
    }

    if(definitions){
      for (const definition in definitions) {
        const title = definition.split("/").slice(-1)[0];
        const scope = definitions[definition];
        await createFile(specVersion, title, JSON.stringify(scope));
      }
    }

  } catch (error) {
    console.log(error);
  }
};
