import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * The first external beta session hit a check whose answer was two lines up
 * on the learner's screen. A check answerable by scrolling teaches nothing.
 * Each teaching skill is loaded standalone, so every one must carry the rule.
 *
 * This fork does not ship `/begin`. adopt-project counts: it replaces
 * start-project + plan-journey for an existing codebase.
 */
const TEACHING_SKILLS = [
  "skills/adopt-project/SKILL.md",
  "skills/next-lesson/SKILL.md",
  "skills/plan-journey/SKILL.md",
  "skills/start-project/SKILL.md",
];

async function readSkill(relativePath) {
  return readFile(join(repoRoot, relativePath), "utf8");
}

test("every teaching skill carries the forward-probing rule itself", async () => {
  for (const relativePath of TEACHING_SKILLS) {
    const skill = await readSkill(relativePath);

    assert.match(
      skill,
      /probe forward, never backward/,
      `${relativePath} does not state the forward-probing rule; skills are loaded standalone, so it cannot inherit it`,
    );
    assert.match(
      skill,
      /predict/i,
      `${relativePath} bans backward checks without naming prediction as the alternative`,
    );
    assert.match(
      skill,
      /would (?:break|stop working|get harder|have to be true)/i,
      `${relativePath} gives no consequence-shaped example of a forward check`,
    );
  }
});

test("no teaching skill asks the learner to read back the explanation just given", async () => {
  const planJourney = await readSkill("skills/plan-journey/SKILL.md");
  assert.doesNotMatch(
    planJourney,
    /in their own words, why the recommended choice fits/,
    "plan-journey still asks the learner to restate the rationale it delivered a breath earlier",
  );

  const startProject = await readSkill("skills/start-project/SKILL.md");
  assert.doesNotMatch(
    startProject,
    /explain back, in their own words, what one or two components are for/,
    "start-project still asks the learner to read the trunk back",
  );

  const adoptProject = await readSkill("skills/adopt-project/SKILL.md");
  assert.doesNotMatch(
    adoptProject,
    /say in their own words what it does for their app/,
    "adopt-project still asks the learner to read back the stack description it just delivered",
  );

  const nextLesson = await readSkill("skills/next-lesson/SKILL.md");
  assert.doesNotMatch(
    nextLesson,
    /in your own words, what's `node_modules\/` for\?/,
    "next-lesson file-map tour still asks what's a file for thirty seconds after the tour",
  );
});
