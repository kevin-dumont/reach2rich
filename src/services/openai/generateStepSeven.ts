"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generateStepSeven(
  deroule: string,
  quiSuisJe: string,
  inNotIn: string,
  pourToiOuNon: string,
  questions: string,
  douleurs: string
) {
  const prompt = `Tu es un expert en copywriting spécialisé dans les pages de vente à haute conversion.  
Je vais te donner un bloc de contenu avec des éléments à exploiter entre ### et ###.

Ton objectif est de transformer ce contenu en une section intitulée :  
⬇︎ Ne rien faire VS Remplir ce formulaire

Structure imposée :

◉ Si tu ne fais rien  
↓ Ligne 1  
↓ Ligne 2  
↓ Ligne 3  
↓ Ligne 4  
✘ Ligne 5  

➜ Phrase finale choc, brutale, chiffrée. Doit créer un électrochoc.

◉ Tu remplis ce formulaire  
↓ Ligne 1  
↓ Ligne 2  
↓ Ligne 3  
↓ Ligne 4  
✔︎ Ligne 5  

➜ Phrase finale douce, positive, désirable. Montre le bénéfice ultime.

Instructions :
- Reste simple, brut, direct.  
- Utilise des phrases concrètes, visuelles, réalistes.  
- Dans le bloc "Tu ne fais rien", mets l'accent sur la perte de CA potentielle sous forme de calcul.  
- Dans le bloc "Tu remplis ce formulaire", mets l'accent sur l'accès à une opportunité réelle.  
- Saute une ligne entre les deux blocs.  
- Pas d'émojis, pas de promesses floues, pas de blabla.  
- Mets des points à la fin des phrases.  
- Le contenu des phrases doit être un calcul de non rentabilité de l'inaction pour le bloc "Tu ne fais rien".  
  L'inverse pour le bloc "Tu remplis ce formulaire".

###
${quiSuisJe}

${pourToiOuNon}

${deroule}

${inNotIn}

${questions}

${douleurs}
###`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4-turbo-preview",
  });

  return completion.choices[0].message.content;
}
