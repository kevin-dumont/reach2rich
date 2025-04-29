"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generateStepSix(
  deroule: string,
  quiSuisJe: string,
  inNotIn: string,
  pourToiOuNon: string,
  questions: string
) {
  const prompt = `Tu es un expert copywriter.

Je vais te donner un bloc de contenu déjà rédigé entre ### et ###.

Ton objectif est de transformer ce contenu en une section intitulée "⬇︎ Tu te reconnais là-dedans ?".

Tu dois procéder de la manière suivante :
1. Étudie le contenu que je vais te copier entre ### et ###.  
2. Garde uniquement les éléments qui décrivent des situations concrètes, répétitives et pénibles que vit ma cible.  
3. Reformule-les de manière percutante, brute, visuelle, sans enrobage.  
4. Ajoute aussi leurs limites actuelles : excuses, tentatives échouées, blocages mentaux.  
5. Termine la section par une phrase choc, brutale, qui met un coup de pression.

Tu dois :
- Être ultra direct.  
- Écrire des phrases courtes.  
- Créer un effet miroir : la personne doit se dire "c'est exactement moi".  
- Ne surtout pas vendre ici.  
- Ne pas mettre d'intro ni de conclusion (à part la punchline finale).  
- Ne pas utiliser d'émojis.  
- Utiliser un format liste à puces brutales.

Format attendu :  
⬇︎ Tu te reconnais là-dedans ?  
- Puce 1  
- Puce 2  
- ...  
- Phrase finale choc.

###
${quiSuisJe}

${pourToiOuNon}

${deroule}

${inNotIn}

${questions}
###`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4-turbo-preview",
  });

  return completion.choices[0].message.content;
}
