"use server";

import { merge } from "@/lib/objects/merge";
import { runPromptAndSaveOffer } from "@/services/offer/run-prompt-and-save-offer";
import { Offer, OfferError } from "@/types/offer";
import { z } from "zod";

const stepSevenSchema = z.object({
  notDoneForYou: z
    .string()
    .min(
      200,
      "Le champ 'notDoneForYou' doit contenir au moins 200 caractères."
    ),
});

export type StepSevenResponse = OfferError<{
  notDoneForYou?: string[];
}>;

export async function generateStepSeven(
  offer: Offer,
  formData: FormData
): Promise<StepSevenResponse> {
  const notDoneForYou = formData.get("notDoneForYou") as string;
  const validationResult = stepSevenSchema.safeParse({ notDoneForYou });

  if (!validationResult.success) {
    return {
      inputErrors: validationResult.error.flatten().fieldErrors,
    };
  }

  const inputs = merge([
    offer,
    { offerJson: { generated: { notDoneForYou } } },
  ]);

  return runPromptAndSaveOffer(getFAQPrompt(inputs), offer, inputs, "FAQ");
}

const getFAQPrompt = (offer: Offer) => {
  return `TON RÔLE :
Joue le rôle de tous mes clients potentiels et identifie les questions relatives à mon offre qu'on pourrait se poser une fois qu'on a lu toute l'offre.

INSTRUCTIONS :
Tu dois procéder de la manière suivante :
1. Étudie l'offre que je vais te copier à la fin.  
2. Identifie toutes les catégories aux questions. (Exemple : Paiement, déroulé, procédés, livrables, concurrences, modalités, comment le produit fonctionne, c'est à qui de faire quoi etc…)  
3. Rédige une question en te mettant à la place du prospect, commence cette question par "Je…"  
4. Formule une réponse concise et fournie qui se collerait parfaitement à ma façon de faire. (Je pourrais ensuite les modifier si nécessaires.)
5. Tu trouveras l'offre pour laquelle tu dois générer les questions relatives entre [[[ et ]]] :

DONNÉES :
Voici un exemple de questions relatives à ma propre offre entre <<< et >>>.  
<<<
➜ Si je veux arrêter le programme en cours de route, comment ça se passe ?  
Tu peux arrêter le programme à tout instant mais le coût total du programme ne sera pas remboursé. Si tu as opté pour un paiement échelonné, il courra jusqu'à paiement intégral. Je suis autant engagé que toi. Je n'arrêterai jamais le programme.

➜ Le programme se déroule uniquement avec toi ?  
Oui. Il se déroulera uniquement avec moi et ce peu importe ce qu'il arrive. Chaque séance individuelle est entre toi et moi. Il n'y aura jamais d'autres experts qui interviendront, je suis engagé contractuellement envers toi.

➜ Possible de mettre le programme en pause ?  
Oui. C'est tout à fait possible, tu peux m'envoyer un message pour mettre en pause à tout instant le programme. Ceci dit, le paiement doit être réglé en intégralité et ne pourra pas être repoussé.

➜ Je publie sur LinkedIn en anglais, ton programme est pour moi ?  
Oui. Je suis bilingue en anglais et je maîtrise parfaitement le déroulé du programme qui peut être adapté à une cible anglophone. Cependant, le groupe d'engagement Linkedin est strictement en Français.

➜ Que se passe-t-il après le programme ?  
Après le programme, 3 choix s'offrent à toi. Tu peux décider de définir de nouveaux objectifs et de reprendre un autre programme pour 6 mois. Tu peux décider de ne pas poursuivre les sessions individuelles mais rester dans la communauté WhatsApp. Ou tu peux tout simplement tout arrêter.

➜ Je n'ai pas besoin du groupe, je suis obligé de parler dedans ?  
Le groupe a une importance capitale dans ton voyage sur LinkedIn, mais si tu ne souhaites pas l'exploiter ceci n'impactera pas les objectifs qu'on se sera fixés. Tu n'es donc pas obligé d'interagir avec les autres participants.

➜ Je suis obligé de suivre à la lettre ce que tu vas me dire ?  
Je suis là pour te donner mon avis et des recommandations d'actions à effectuer. Tu es libre de faire ce que tu veux et de suivre ton propre chemin. Mais si ça ne fonctionne pas, ce ne sera pas ma responsabilité.

➜ Si je n'arrive pas à vendre quoi que ce soit, il se passe quoi ?  
Ça ne m'est jamais arrivé, et pour aucun des participants. Mais si ça arrivait un jour, nous trouverons une solution en changeant des variables tel que le profil, le produit, l'offre ou la stratégie éditoriale jusqu'à ce que ça fonctionne. Il est évidemment très important que tu saches que je ne suis soumis à aucun engagement de résultats.

➜ Puis-je me faire accompagner à côté du programme ?  
Tu fais ce que tu veux tant que ça n'interfère pas avec les recommandations que je vais te partager pour atteindre nos objectifs qu'on se sera fixés. J'ai également des participants qui viennent avec leur coach aux sessions individuelles.

➜ Si je ne suis pas disponible à notre séance, c'est possible de décaler ?  
Bien évidemment, je fonctionne en bonne intelligence. Ceci dit j'attends de toi une certaine fiabilité pour me prévenir assez tôt dans la mesure possible. Cependant si tu ne te manifestes pas au rendez-vous sans me prévenir et tu ne réponds pas à mes messages, je ne relancerai pas la conversation. J'suis pas ta mère.

➜ Je peux te parler entre chaque séance ?  
Oui. On peut s'appeler si je suis disponible, ou bien directement sur WhatsApp, je te répondrai tous les jours et à toutes les questions que tu me poseras.

➜ Si j'ai un Ghostwriter ou Community Manager, le programme marche aussi ?  
Oui. J'ai plusieurs clients qui font appel à des prestataires pour la rédaction de leurs publications. Dans ce cas nous adapterons le programme pour atteindre les objectifs du mieux qu'on puisse.

➜ On peut être plusieurs à suivre le programme ?  
Oui. Tu peux venir à plusieurs à chacune des séances, cependant il n'y aura pas de places supplémentaires dans la communauté, ni plus de séances individuelles qu'une toutes les 2 semaines.

➜ Comment s'effectue le règlement ?  
Par prélèvement bancaire avec envoi automatique des factures par mail à chaque date de prélèvement.

➜ On peut régler en plusieurs fois ?  
Oui, jusqu'à 6 fois. Tu peux même commencer à payer jusqu'à 3 mois après avoir commencé le programme.
>>>

[[[
Qui suis-je ?
${offer.offerJson?.generated?.whoAmI}

Ce programme est fait pour toi si :
${offer.offerJson?.generated?.doneForYou}

Ce programme n'est pas fait pour toi si :
${offer.offerJson?.generated?.notDoneForYou}

Le déroulé du programme :
${offer.offerJson?.generated?.steps}

Ce que comprend l'offre :
${offer.offerJson?.generated?.included}

Ce que ne comprend pas l'offre :
${offer.offerJson?.generated?.notIncluded}
]]]

FORMAT ATTENDU :
- Tu ne dois pas mettre d'émojis.
- Tu doit commencer chaque question par le symbole "➜"
- Tu ne dois pas utiliser de markdown, pas de gras, ni de **, pas de souligné, pas de italique, pas de titres.
- Le retour ne doit contenir que ce qui est demandé, exactement au même format que le texte entre <<< et >>>.
- Tu dois impérativement t'inspirer de l'exemple mais ne pas le copier.  
- Tu dois être exhaustif dans la description de manière percutante, concis mais descriptif.  
- Tu dois faire des phrases courtes.`;
};
