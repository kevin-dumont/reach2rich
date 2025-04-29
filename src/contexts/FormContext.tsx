"use client";

import { createContext, useContext, useState } from "react";
import { FormData } from "@/types/form";
import { toast } from "sonner";
import {
  generateStepOne,
  generateStepTwo,
  generateStepThree,
  generateStepFour,
  generateStepFive,
  generateStepSix,
  generateStepSeven,
  generateFinal,
} from "@/services/openai";

interface FormContextType {
  step: number;
  loading: boolean;
  generatedSteps: number[];
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: (e: React.FormEvent) => Promise<void>;
  previousStep: () => void;
  regenerateStep: (e: React.FormEvent) => Promise<void>;
  isLastStep: boolean;
  canGoBack: boolean;
  canRegenerate: boolean;
  finish: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatedSteps, setGeneratedSteps] = useState<number[]>([]);
  const [formData, setFormData] = useState<FormData>({
    offer: "",
    steps: "",
    stepOneResult: "",
    cv: "",
    stepTwoResult: "",
    stepThreeResult: "",
    stepFourResult: "",
    stepFiveResult: "",
    stepSixResult: "",
    stepSevenResult: "",
    finalResult: "",
  });

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const generateContent = async (currentStep: number) => {
    let result: string | undefined;

    try {
      if (currentStep === 1) {
        result =
          (await generateStepOne(formData.offer, formData.steps)) ?? undefined;
        updateFormData({ stepOneResult: result });
      } else if (currentStep === 2) {
        result =
          (await generateStepTwo(
            formData.cv,
            formData.stepOneResult,
            formData.offer
          )) ?? undefined;
        updateFormData({ stepTwoResult: result });
      } else if (currentStep === 3) {
        result =
          (await generateStepThree(
            formData.stepOneResult,
            formData.stepTwoResult
          )) ?? undefined;
        updateFormData({ stepThreeResult: result });
      } else if (currentStep === 4) {
        result =
          (await generateStepFour(
            formData.stepOneResult,
            formData.stepTwoResult,
            formData.stepThreeResult
          )) ?? undefined;
        updateFormData({ stepFourResult: result });
      } else if (currentStep === 5) {
        result =
          (await generateStepFive(
            formData.stepOneResult,
            formData.stepTwoResult,
            formData.stepThreeResult,
            formData.stepFourResult
          )) ?? undefined;
        updateFormData({ stepFiveResult: result });
      } else if (currentStep === 6) {
        result =
          (await generateStepSix(
            formData.stepOneResult,
            formData.stepTwoResult,
            formData.stepThreeResult,
            formData.stepFourResult,
            formData.stepFiveResult
          )) ?? undefined;
        updateFormData({ stepSixResult: result });
      } else if (currentStep === 7) {
        result =
          (await generateStepSeven(
            formData.stepOneResult,
            formData.stepTwoResult,
            formData.stepThreeResult,
            formData.stepFourResult,
            formData.stepFiveResult,
            formData.stepSixResult
          )) ?? undefined;
        updateFormData({ stepSevenResult: result });
      } else if (currentStep === 8) {
        result = await generateFinal(
          formData.stepOneResult,
          formData.stepTwoResult,
          formData.stepThreeResult,
          formData.stepFourResult,
          formData.stepFiveResult,
          formData.stepSixResult,
          formData.stepSevenResult
        );
        updateFormData({ finalResult: result });
      }

      if (result && !generatedSteps.includes(currentStep)) {
        setGeneratedSteps((prev) => [...prev, currentStep]);
      }

      toast.success(`Étape ${currentStep} générée avec succès`);
      return result;
    } catch (error) {
      toast.error(`Erreur lors de la génération de l'étape ${currentStep}`);
      throw error;
    }
  };

  const nextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      if (!generatedSteps.includes(step)) {
        await generateContent(step);
      }
      setStep((s) => Math.min(s + 1, 9));
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("Une erreur est survenue lors du passage à l'étape suivante");
    } finally {
      setLoading(false);
    }
  };

  const regenerateStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      await generateContent(step);
      setStep((s) => Math.min(s + 1, 9));
      toast.success("Contenu régénéré avec succès");
    } catch (error) {
      console.error("Error regenerating content:", error);
      toast.error("Une erreur est survenue lors de la régénération du contenu");
    } finally {
      setLoading(false);
    }
  };

  const previousStep = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  const finish = () => {
    console.log("Final form data:", formData);
    toast.success("Formulaire terminé avec succès");
  };

  const isLastStep = step === 9;
  const canGoBack = step > 1;
  const canRegenerate = generatedSteps.includes(step) && !isLastStep;

  return (
    <FormContext.Provider
      value={{
        step,
        loading,
        generatedSteps,
        formData,
        updateFormData,
        nextStep,
        previousStep,
        regenerateStep,
        isLastStep,
        canGoBack,
        canRegenerate,
        finish,
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
