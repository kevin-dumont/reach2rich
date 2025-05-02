import { updateOffer } from "@/services/supabase/offers/offerRepository";
import { Offer, OfferError } from "@/types/offer";
import { RecursivePartial } from "@/types/utility";
import { openai } from "@/services/openai/openai";

export const runPromptAndSaveOffer = async <T extends Record<string, string[]>>(
  prompt: string,
  offer: Offer,
  partialOffer: RecursivePartial<Offer>,
  generatedFieldToUpdate: keyof Offer["offerJson"]["generated"]
): Promise<OfferError<T>> => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o",
    });

    const openAiResponse = completion.choices[0].message.content;

    console.log("openAiResponse", openAiResponse);

    if (!openAiResponse) {
      return { error: "Aucun résultat de la part de OpenAI" };
    }

    const updatedOffer = {
      ...offer,
      ...partialOffer,
      offerJson: {
        ...offer.offerJson,
        ...partialOffer.offerJson,
        generated: {
          ...offer.offerJson?.generated,
          ...partialOffer.offerJson?.generated,
          [generatedFieldToUpdate]: openAiResponse,
        },
        userInput: {
          ...offer.offerJson?.userInput,
          ...partialOffer.offerJson?.userInput,
        },
      },
    };

    const updatedOfferResult = await updateOffer(updatedOffer);

    if (!updatedOfferResult) {
      return { error: "Erreur lors de la mise à jour de l'offre" };
    }

    return {
      error: undefined,
      inputErrors: undefined,
      updatedOffer: updatedOfferResult,
    };
  } catch {
    return {
      error: "Une erreur inconnue est survenue, veuillez réessayer plus tard.",
    };
  }
};
