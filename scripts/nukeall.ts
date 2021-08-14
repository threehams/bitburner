import { BitBurner } from "../types/bitburner";
import {
  Column,
  COLUMNS,
  serverList,
  SortOrder,
  SORT_ORDERS,
} from "./shared-server-list";

export async function main(ns: BitBurner) {
  const [, column = "hackLevel", sortOrder = "asc"] = ns.args;

  if (!isValidSort(column) || !isValidSortOrder(sortOrder)) {
    ns.tprint(`Usage: run walk.js --sort [column] [sort-order]`);
    ns.tprint(`Available columns: ${COLUMNS.join(", ")}`);
    ns.tprint(`Available sort orders: ${SORT_ORDERS.join(", ")}`);
    return;
  }
  const hackingLevel = ns.getHackingLevel();
  const servers = await serverList(ns, column, sortOrder);

  servers.forEach(
    ({
      growAmount,
      hackLevel,
      // hackValue,
      hasRoot,
      incomeRate,
      name,
      security,
      serverMoney,
    }) => {
      ns.tprint(
        [
          hasRoot ? "🟩" : "🟥",
          formatNumber(hackLevel.toFixed(0)).padStart(5),
          formatNumber(security.toFixed(0)).padStart(6),
          `$${formatNumber(serverMoney.toFixed(0))}`.padStart(16),
          // `$${formatNumber(hackValue.toFixed(0))}`.padStart(14),
          `$${formatNumber(incomeRate.toFixed(0))}/sec`.padStart(14),
          formatNumber(growAmount.toFixed(0)).padStart(5),
          name,
        ].join(" ")
      );
    }
  );
  const hackable = servers.filter((server) => {
    return hackingLevel >= ns.getServerRequiredHackingLevel(server.name);
  });
  hackable.forEach((server) => {
    hack(server.name, ns);
  });
}

const dive = (source: string, last: string, ns: BitBurner): string[] => {
  return ns
    .scan(source)
    .flatMap((server) => {
      if (server === last) {
        return [];
      }
      return dive(server, source, ns);
    })
    .concat([source]);
};

const programs = [
  "brutessh",
  "ftpcrack",
  "relaysmtp",
  "httpworm",
  "sqlinject",
] as const;

const hack = async (server: string, ns: BitBurner) => {
  if (ns.hasRootAccess(server)) {
    return;
  }

  ns.tprint("hacking: ", server);
  for (const program of programs) {
    try {
      ns[program](server);
    } catch (err) {
      // ns.tprint("failed to run ", program);
    }
  }

  try {
    ns.nuke(server);
    ns.tprint("successfully hacked: ", server);
  } catch (err) {
    ns.tprint("not enough open ports to hack: ", server);
  }
};

const formatNumber = (num: number | string) => {
  var parts = num.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

const isValidSort = (sort: string): sort is Column => {
  if (!COLUMNS.includes(sort as Column)) {
    return false;
  }
  return true;
};

const isValidSortOrder = (order: string): order is SortOrder => {
  if (!SORT_ORDERS.includes(order as SortOrder)) {
    return false;
  }
  return true;
};
