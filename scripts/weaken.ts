import { BitBurner } from "../types/bitburner";

export async function main(ns: BitBurner) {
  const [server] = ns.args;

  while (true) {
    await ns.weaken(server);

    await ns.sleep(50);
  }
}
