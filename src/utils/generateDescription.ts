import { readFileSync } from "fs";
import parse from "./markdown-to-json";
import { retrieveObj } from "./simpleReuse";

export default function generateDescription(objectType: string){
        const mdPath: string = "src/data/specification/v2.5.0.md";
        const mdContent: any = readFileSync(mdPath, "utf-8");
        const parsedContent = parse(mdContent);
        const schemaObject =
          parsedContent["AsyncAPI Specification"].Specification.Schema;

        const res = retrieveObj(schemaObject, objectType);
        return res

}