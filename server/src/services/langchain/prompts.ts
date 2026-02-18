import { PromptTemplate } from '@langchain/core/prompts';

export const eligibilityExplanationPrompt = PromptTemplate.fromTemplate(`Given:
Profile: {state}, {landholding} acres, {cropTypes}, {socialCategory}
Scheme: {schemeName}
Decision: {eligible}
Rule: {ruleBasis}

Generate JSON:
{{"explanation":"<why eligible/not eligible in 2 sentences>","confidenceNote":"<reliability factor>"}}

JSON:`);

export const nextStepsPrompt = PromptTemplate.fromTemplate(`Farmer eligible for {schemeName}.
Documents: {documents}
Deadline: {deadline}

Generate JSON:
{{"steps":["<action 1>","<action 2>","<action 3>"]}}

JSON:`);