"use client";

import { Card } from "@/components/ui/card";
import { FormProgress } from "@/components/blocks/offers/form-progress";
import { StepOne } from "@/components/blocks/offers/steps/step-1";
import { StepTwo } from "@/components/blocks/offers/steps/step-2";
import { StepThree } from "@/components/blocks/offers/steps/step-3";
import { StepFour } from "@/components/blocks/offers/steps/step-4";
import { StepFive } from "@/components/blocks/offers/steps/step-5";
import { StepSix } from "@/components/blocks/offers/steps/step-6";
import { StepSeven } from "@/components/blocks/offers/steps/step-7";
import { StepEight } from "@/components/blocks/offers/steps/step-8";
import { StepNine } from "@/components/blocks/offers/steps/step-9";
import { StepTen } from "@/components/blocks/offers/steps/step-10";
import { StepEleven } from "@/components/blocks/offers/steps/step-11";

import { useForm } from "@/contexts/form-context";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 11;

export default function HomePage() {
  const { step } = useForm();

  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-8 p-6">
        <FormProgress currentStep={step} totalSteps={TOTAL_STEPS} />

        {step === 1 && <StepOne />}
        {step === 2 && <StepTwo />}
        {step === 3 && <StepThree />}
        {step === 4 && <StepFour />}
        {step === 5 && <StepFive />}
        {step === 6 && <StepSix />}
        {step === 7 && <StepSeven />}
        {step === 8 && <StepEight />}
        {step === 9 && <StepNine />}
        {step === 10 && <StepTen />}
        {step === 11 && <StepEleven />}
      </Card>
      <Card className="col-span-4 p-6">
        <Stepper />
      </Card>
    </div>
  );
}

function Stepper() {
  const { step, setStep, offer } = useForm();

  const steps = [
    { name: "Vos informations" },
    {
      name: "Le déroulé de l'offre",
      canGoToStep: () => !!offer?.offerJson?.generated?.steps,
    },
    {
      name: "Qui suis-je ?",
      canGoToStep: () => !!offer?.offerJson?.generated?.whoAmI,
    },
    {
      name: "Ce qui est inclus",
      canGoToStep: () => !!offer?.offerJson?.generated?.included,
    },
    {
      name: "Ce qui n'est pas inclus",
      canGoToStep: () => !!offer?.offerJson?.generated?.notIncluded,
    },
    {
      name: "Pour vous si...",
      canGoToStep: () => !!offer?.offerJson?.generated?.doneForYou,
    },
    {
      name: "Pas pour vous si...",
      canGoToStep: () => !!offer?.offerJson?.generated?.notDoneForYou,
    },
    {
      name: "Les questions fréquentes",
      canGoToStep: () => !!offer?.offerJson?.generated?.FAQ,
    },
    {
      name: "Tu te reconnais ?",
      canGoToStep: () => !!offer?.offerJson?.generated?.painPoints,
    },
    {
      name: "Si tu ne fais rien",
      canGoToStep: () => !!offer?.offerJson?.generated?.doNothing,
    },
    {
      name: "Si tu remplis ce formulaire",
      canGoToStep: () => !!offer?.offerJson?.generated?.fillTheForm,
    },
  ];

  const handleStepClick = (
    stepIndex: number,
    step: { canGoToStep?: () => boolean }
  ) => {
    if (!step.canGoToStep || step.canGoToStep()) {
      setStep(stepIndex);
    }
  };

  return (
    <div className="flex flex-col relative">
      {steps.map((s, index) => (
        <div
          key={s.name}
          className="flex gap-4 cursor-pointer"
          onClick={() => handleStepClick(index + 1, s)}
        >
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                {
                  "bg-primary text-white": step === index + 1,
                  "bg-black text-white": step > index + 1,
                  "bg-accent": step < index + 1,
                }
              )}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn("h-5 border-l-4", {
                  "border-black": step > index + 1,
                  "border-accent": step <= index + 1,
                })}
              />
            )}
          </div>
          <div className="flex flex-col pt-2">
            <span
              className={cn("text-sm", {
                "font-semibold": step === index + 1,
              })}
            >
              {s.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
