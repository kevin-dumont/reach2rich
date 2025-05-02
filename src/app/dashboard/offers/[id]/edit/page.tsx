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
      </Card>
      <Card className="col-span-4 p-6">
        <Stepper />
      </Card>
    </div>
  );
}

function Stepper() {
  const { step } = useForm();

  const steps = [
    { number: 1, name: "Détails de l'offre" },
    { number: 2, name: "Votre parcours" },
    { number: 3, name: "Détails de l'offre" },
    { number: 4, name: "Rédaction" },
    {
      number: 5,
      name: "Questions des clients",
    },
    { number: 6, name: "Points de douleur" },
    { number: 7, name: "Conversion" },
    { number: 8, name: "Finalisation" },
    { number: 9, name: "Achèvement" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {steps.map((s) => (
        <div key={s.number} className="flex items-center gap-4">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer bg-accent",
              {
                "bg-primary text-white": step === s.number,
              }
            )}
          >
            {s.number}
          </div>
          <div className="flex flex-col">
            <span
              className={cn("text-sm", {
                "font-semibold": step === s.number,
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
