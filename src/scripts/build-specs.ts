import { writeFileSync } from "fs";
import { resolve } from "path";
import fetch from "node-fetch";

export default async function buildSpecs() {
  try {
    let res = await fetch("http://asyncapi.com/definitions/2.5.0.json", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const spec = await res.json();
    console.log(spec);
  } catch (error) {
    console.log(error);
  }
};
