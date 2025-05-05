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
  const { step } = useForm();

  const steps = [
    { number: 1, name: "Vos informations" },
    { number: 2, name: "Le déroulé de l'offre" },
    { number: 3, name: "Qui suis-je ?" },
    { number: 4, name: "Ce qui est inclus" },
    { number: 5, name: "Ce qui n'est pas inclus" },
    { number: 6, name: "Pour vous si..." },
    { number: 7, name: "Pas pour vous si..." },
    { number: 8, name: "Les questions fréquentes" },
    { number: 9, name: "Tu te reconnais ?" },
    { number: 10, name: "Si tu ne fais rien" },
    { number: 11, name: "Si tu remplis ce formulaire" },
  ];

  return (
    <div className="flex flex-col relative">
      {steps.map((s, index) => (
        <div key={s.number} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer",
                {
                  "bg-primary text-white": step === s.number,
                  "bg-black text-white": step > s.number,
                  "bg-accent": step < s.number,
                }
              )}
            >
              {s.number}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn("h-5 border-l-4", {
                  "border-black": step > s.number,
                  "border-accent": step <= s.number,
                })}
              />
            )}
          </div>
          <div className="flex flex-col pt-2">
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
