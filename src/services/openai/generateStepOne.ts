"use server";

import { openai } from "./openai";

export async function generateStepOne(offer: string, steps: string) {
  const prompt = `Tu es un expert business et marketing.

J'attends de toi que tu structures un déroulé d'offre avec les phases clés du programme, qui doivent correspondre à ce que je vais te donner entre ces caractères < >.

Tu dois impérativement concevoir les différentes phases de la façon expliquée entre << et >>.

<<  
Phase X (où X est remplacé par le numéro de la phase)  
TITRE (Remplace le titre, il doit être court et percutant. Je vais te donner des exemples entre [ ] à la suite, tu pourras t'aider de leur structure)  
- Élément 1  
- Élément 2  
- Élément 3  
- Élément 4  
- Élément 5  
(Les 5 éléments doivent être le détail de ce qu'on va voir dans la phase. Des phrases courtes et percutantes. Remplace "Élément" et ne mets que la phrase.)  
Objectif : (L'objectif doit être clair, concis et mesurable.)  
Durée des rendez-vous : (La durée peut être modifiée par la suite. Mets déjà une idée de ce que ça doit prendre en terme de temps.)  
>>

Tu dois mettre autant de phases qu'il y en a dans mon programme/offre/masterclass.  
Tu dois faire des phrases courtes.  
L'objectif est que ce soit clair et limpide pour le potentiel client.  
Il doit tout comprendre.  
Évite le jargon trop technique.

<${steps}>

Rappelle-toi que mon offre actuelle pour laquelle tu dois créer la suite des éléments est la suivante :
${offer}`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4-turbo-preview",
  });

  return completion.choices[0].message.content;
}
