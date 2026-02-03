# Session Notes (Anonymized Client)

**Date:** 2026-01-05 | **Duration:** ~59 min **Attendees:** Andrea Goulet, M. Scott Ford

------

## Overview

Scott spent ~15-16 hours on his blog during the holiday break and feels proud of the progress. The session explored why budgeting 20 hours (vs. 1 hour) shifted his emotional experience from embarrassment to pride, identified a sunk cost fallacy pattern around rabbit holes, and established experiments for estimation and context capture.

------

## Experimental Design

### 1. Friction Point

Estimating accurately and avoiding rabbit holes that delay launching the blog.

### 2. Context

| Theme            | Description                                                  |
| ---------------- | ------------------------------------------------------------ |
| Previous session | Felt embarrassed about lack of progress when estimating 1 hour for tasks |
| This session     | Felt proud after budgeting 20 hours and spending ~15-16      |
| Work blocks      | Morning sessions continue to be effective; context switching is expensive |
| Documentation    | Writing tickets/documentation "doesn't feel like work," contributing to sunk cost trap |
| Work situation   | Team lead has partially lost confidence; increased estimation requests at work |

### 3. Variables

| Variable                      | Observed Outcome                                             |
| ----------------------------- | ------------------------------------------------------------ |
| Time budget (1 hr vs 20 hrs)  | 20 hrs → pride; 1 hr → embarrassment                         |
| Doom scrolling replacement    | Successfully swapped for blog work multiple times            |
| Breaking work into pieces     | Easier to estimate smaller chunks                            |
| Claude Code for tedious tasks | Content import, to-do list generation, redirect script creation worked well |

### 4. Success Criteria

| Criterion                                            | Status             |
| ---------------------------------------------------- | ------------------ |
| Blog live at [mscottford.com](http://mscottford.com) | In progress        |
| First post published                                 | Pending            |
| Proud of visual design                               | Achieved locally   |
| Able to publish new articles                         | Pending deployment |

### 5. Hypotheses

| IF                                                           | THEN                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| Scott quadruples his gut instinct for estimates              | He'll avoid disappointment and feel proud of progress        |
| Scott uses Claude Code to capture thinking when hitting a blocker | He can avoid sunk cost fallacy and context-switch more easily |
| Scott breaks big things into smaller pieces before estimating | Estimates become more accurate                               |

### 6. Measurement

| Metric                        | How to Track                                  |
| ----------------------------- | --------------------------------------------- |
| Actual time vs estimated time | Track for each task                           |
| Sunk cost trap occurrences    | Notice when falling in and capture the moment |
| Blog launch                   | Binary: is it live?                           |

### 7. Experiment

| Behavior Change                                              | Expectation                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| **Estimation approach:** Before communicating any expectation (external or internal), break the big thing into smaller pieces, apply 4x multiplier to gut instinct, sum the pieces | More accurate estimates, less disappointment                 |
| **Avoiding rabbit holes:** When a task exceeds its budget and isn't mission-critical, pause. Use Claude Code to capture: goal, blockers, potential solutions. Create WIP commit with to-do list, push to branch, link in ticket | Escape sunk cost trap, preserve context without full documentation overhead |
| **Ask:** "How essential is this for accomplishing the actual goal?" | Prioritize mission-critical work                             |

### 8. Follow What Works

| Past Experiment                                              | Effectiveness                                                |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| Budgeting more time (20 hrs vs 1 hr)                         | Proud vs embarrassed                                         |
| Morning work sessions                                        | Consistent progress                                          |
| Doom scrolling → blog work swap                              | Successful                                                   |
| Claude Code for tedious tasks                                | Content import, to-do generation, redirect scripts all worked |
| "If I search and don't find the answer, publish when I figure it out" | Content strategy in place                                    |

------

## Action Items

**Scott:**

- Hide non-essential elements (2 hrs budgeted)
- Fix broken images in imported posts
- Complete deployment with staging environment (10 hrs budgeted)
- Set up redirect links (4 hrs budgeted)
- Update essential content (remove stock/template text)
- Write first blog post (favicon generation process)
- Test everything works (images, RSS, URLs)

**Andrea:**

- Post notes in Heartbeat

------

## Planning

| Task                        | Estimate    |
| --------------------------- | ----------- |
| Hide non-essential elements | 2 hrs       |
| Deployment + staging        | 10 hrs      |
| DNS + redirect links        | 4 hrs       |
| Content updates + testing   | ~4 hrs      |
| **Total remaining**         | **~20 hrs** |

------

## References

- [Content Collections library](https://www.content-collections.dev/) — separating content from display
- Claude Code — content import, to-do list generation, redirect script creation
- AWS S3 + CloudFront — new hosting approach (replaces GitHub Pages for redirect support)

------

## Next Session

- Did the 4x estimation approach help with both personal project and work estimates?
- How did the "Claude Code for context capture" experiment go when hitting blockers?
- Is the blog live? If not, what blocked it?
- How's the confidence situation with team lead?