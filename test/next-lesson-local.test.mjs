import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

async function readNextLesson() {
  return readFile(join(repoRoot, "skills/next-lesson/SKILL.md"), "utf8");
}

test("prior knowledge records understood and is not today's 20%", async () => {
  const skill = await readNextLesson();

  assert.match(
    skill,
    /self-reported prior knowledge/,
    "next-lesson must name the exact evidence note for a prior-knowledge claim",
  );
  assert.match(
    skill,
    /do not make it today's 20%/i,
    "a known concept must not become the sitting's authorship hole",
  );
});

test("chat mid-watch outranks a bare watcher nudge", async () => {
  const skill = await readNextLesson();

  assert.match(
    skill,
    /outrank/i,
    "next-lesson must say a chat message outranks the file watch",
  );
  assert.match(
    skill,
    /whole reply/,
    "next-lesson must name a watcher-only message as a failed whole reply",
  );
});

test("fork overlay still defaults to zpd and plain TODO", async () => {
  const skill = await readNextLesson();

  assert.match(skill, /authorship-policy: zpd/);
  assert.match(skill, /\/\/ TODO/);
  assert.doesNotMatch(
    skill,
    /TODO\(you\)/,
    "do not restore upstream TODO(you); nvim highlighting needs plain TODO",
  );
});
