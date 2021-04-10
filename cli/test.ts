import { parse } from 'https://deno.land/std/flags/mod.ts';
import { resolve } from 'https://deno.land/std/path/mod.ts';
import { walk } from 'https://deno.land/std/fs/mod.ts';

async function main(args: string[]) {
  const {
    type,
    name,
    not,
    help,
    _: [dir = '.'],
  } = parse(args);

  const dirFullPath = resolve(Deno.cwd(), String(dir));
  let includeFiles = true;
  let includeDirs = true;
  let types = type ? (Array.isArray(type) ? type : [type]) : ['f', 'd'];

  if (!types.includes('f')) {
    includeFiles = false;
  }

  if (!types.includes('d')) {
    includeDirs = false;
  }

  const options = {
    maxDepth: 2,
    includeFiles,
    includeDirs,
    followSymlinks: false,
    skip: [/node_modules/g],
  };

  for await (const entry of walk(dirFullPath, options)) {
    console.log(entry.path);
  }
}

main(Deno.args);
