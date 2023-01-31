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
        console.log("Directory created successfully!");
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
    
    const mdPath: string = 'src/data/specification/v2.5.0.md';
    const mdContent: any = fs.readFileSync(mdPath, "utf-8");

    const result = parse(mdContent);
    console.log(result)
    // const tree = fromMarkdown(mdContent);
    // console.log(tree.children[7]);
    // //  const testMd = mdExtract(
    //    "",
    //    { gfm: false },
    //    mdContent
    //  ).join("\n");

    //  console.log(testMd)

    const spec: any = await res.json();
    const properties = spec.properties;
    const definitions = spec.definitions;
    const specVersion = properties.asyncapi.enum[0];     
    if(properties){
      // create spec directory
      await createDir(specVersion)
      await createFile(specVersion, 'asyncapi.json', JSON.stringify(properties));
      // Create default spec config json
      const filePath = "src/data/2.5.0/asyncapi.json";
       const fileContent: any = fs.readFileSync(filePath, "utf-8");
       const data = JSON.parse(fileContent);
    }

    if(definitions){
      // write all definations to spec directory
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
