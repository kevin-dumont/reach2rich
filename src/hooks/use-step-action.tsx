import { useForm } from "@/contexts/form-context";
import { Offer, OfferError } from "@/types/offer";

export const useStepAction = <T extends OfferError<Record<string, string[]>>>(
  action: (offer: Offer, formData: FormData) => Promise<T>
) => {
  const { offer, setStep, setOffer } = useForm();

  const onSubmit = async (prevState: T, formData: FormData) => {
    if (!offer) return prevState;

    const result = await action(offer, formData);

    if (result?.updatedOffer) {
      setStep((s) => s + 1);
      setOffer(result?.updatedOffer);
    }

    return result;
  };

  return onSubmit;
};
