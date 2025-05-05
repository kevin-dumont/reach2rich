"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Offer } from "@/types/offer";
import { useParams } from "next/navigation";
import { fetchOfferData } from "@/services/supabase/offers/offerRepository";

interface FormContextType {
  isLoading: boolean;
  offer: Offer | null;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setOffer: React.Dispatch<React.SetStateAction<Offer | null>>;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: React.ReactNode }) {
  const { id } = useParams();
  const [step, setStep] = useState(1);
  const [offer, setOffer] = useState<Offer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOffer = async () => {
      setIsLoading(true);

      const offer = await fetchOfferData(id as string);

      console.log("offer", offer);

      setOffer(offer);
      setIsLoading(false);
    };

    if (id) {
      fetchOffer();
    }
  }, [id]);

  return (
    <FormContext.Provider
      value={{
        isLoading,
        offer,
        step,
        setStep,
        setOffer,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useForm() {
  const context = useContext(FormContext);

  if (context === undefined) {
    throw new Error("useForm must be used within a FormProvider");
  }

  return context;
}
