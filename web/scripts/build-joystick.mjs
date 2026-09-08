/**
 * Splits the Tripo joystick GLB into two independently loadable, compressed
 * parts — base and lever — so the lever can be pivoted at runtime.
 *
 * The source is 64 MB / 1.98M triangles / 65 separate 0.5-0.9 MB JPEGs, which
 * is unshippable. This decimates, merges texture payloads down and applies
 * meshopt compression.
 *
 * Run: node scripts/build-joystick.mjs <src.glb>
 */
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS, EXTMeshoptCompression } from "@gltf-transform/extensions";
import {
  dedup,
  prune,
  weld,
  simplify,
  textureCompress,
  quantize,
} from "@gltf-transform/functions";
import { MeshoptSimplifier, MeshoptEncoder } from "meshoptimizer";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

/* the six parts that form the shaft above the socket, identified by rendering
   the model and highlighting candidates — Tripo's names carry no semantics */
const LEVER = new Set([
  "tripo_part_17",
  "tripo_part_9",
  "tripo_part_11",
  "tripo_part_8",
  "tripo_part_44",
  "tripo_part_48",
]);

const src = process.argv[2];
const outDir = path.join(process.cwd(), "public", "models");
fs.mkdirSync(outDir, { recursive: true });

await MeshoptSimplifier.ready;
await MeshoptEncoder.ready;

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ "meshopt.encoder": MeshoptEncoder });

async function build(name, keep, { ratio, texture }) {
  const doc = await io.read(src);
  const root = doc.getRoot();

  for (const node of root.listNodes()) {
    const n = node.getName();
    if (!node.getMesh()) continue;
    if (!keep(n)) node.dispose();
  }

  await doc.transform(
    prune(),
    dedup(),
    weld(),
    simplify({ simplifier: MeshoptSimplifier, ratio, error: 0.004 }),
    textureCompress({
      encoder: sharp,
      targetFormat: "webp",
      resize: [texture, texture],
      quality: 78,
    }),
    quantize(),
  );

  doc
    .createExtension(EXTMeshoptCompression)
    .setRequired(true)
    .setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.QUANTIZE });

  const out = path.join(outDir, `${name}.glb`);
  await io.write(out, doc);

  let tris = 0;
  for (const mesh of doc.getRoot().listMeshes())
    for (const prim of mesh.listPrimitives()) {
      const idx = prim.getIndices();
      tris += (idx ? idx.getCount() : prim.getAttribute("POSITION").getCount()) / 3;
    }
  const kb = fs.statSync(out).size / 1024;
  console.log(
    `  ${name.padEnd(6)} ${kb.toFixed(0).padStart(6)} KB   ${Math.round(tris).toLocaleString().padStart(9)} tris   ${doc.getRoot().listTextures().length} textures`,
  );
  return kb;
}

console.log(`source: ${(fs.statSync(src).size / 1048576).toFixed(1)} MB\n`);
const a = await build("joystick-base", (n) => !LEVER.has(n), { ratio: 0.05, texture: 512 });
const b = await build("joystick-lever", (n) => LEVER.has(n), { ratio: 0.14, texture: 768 });
console.log(`\n  total  ${(a + b).toFixed(0)} KB`);
