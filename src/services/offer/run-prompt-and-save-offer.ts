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
      model: "gpt-4-turbo-preview",
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

    console.log("updatedOffer", updatedOffer);

    await updateOffer(updatedOffer);

    return {
      error: undefined,
      inputErrors: undefined,
      updatedOffer: offer,
    };
  } catch {
    return {
      error: "Une erreur inconnue est survenue, veuillez réessayer plus tard.",
    };
  }
};
