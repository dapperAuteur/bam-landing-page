// Phrase lists for the AI-writing-tells checks, shared by
// scripts/audit-ai-writing-tells.mjs (ranked report) and
// scripts/check-blog-drafts.mjs (pass/fail gate on drafts).
//
// HIGH: near-diagnostic clichés. MED: common-but-telling. LOW: weak signals.
// Matched case-insensitively as whole phrases.

export const HIGH = [
  'delve into', 'delved into', 'in today’s fast-paced', "in today's fast-paced",
  'a testament to', 'stands as a testament', 'rich tapestry', 'tapestry of',
  'navigating the complexities', 'navigate the complexities', 'in the realm of',
  'treasure trove', 'unlock the power', 'unlock the potential', 'unlock the secrets',
  'embark on a journey', 'ever-evolving', 'ever-changing landscape', 'needless to say',
  'without further ado', 'when it comes to', 'harness the power', 'look no further',
  'dive into the world', 'in the world of', 'at the end of the day', 'it goes without saying',
  'the power of', 'unleash the', 'paving the way', 'a game-changer', 'game changer',
  'in conclusion', 'last but not least',
]
export const MED = [
  'it’s important to note', "it's important to note", 'it’s worth noting', "it's worth noting",
  'it is worth noting', 'that being said', 'moreover', 'furthermore', 'additionally,',
  'in summary', 'leverage', 'seamless', 'seamlessly', 'robust', 'elevate your',
  'cutting-edge', 'boasts', 'plays a crucial role', 'plays a pivotal role',
  'plays a vital role', 'plays a key role', 'foster a', 'underscore', 'pivotal',
  'myriad', 'showcase', 'holistic', 'first and foremost', 'on the other hand',
]
export const LOW = [
  'let’s dive', "let's dive", 'let’s explore', "let's explore", 'let’s take a look',
  "let's take a look", 'firstly', 'secondly', 'thirdly', 'in this article', 'in this post',
  'in this guide', 'by the end of this', 'keep in mind', 'whether you’re a', "whether you're a",
  'remember,', 'crucial', 'vital', 'comprehensive', 'vibrant',
]
