"use client";

import { Card } from "@/components/ui/card";
import { FormProgress } from "@/components/form/FormProgress";
import { FormFooter } from "@/components/form/FormFooter";
import { StepOne } from "@/components/form/steps/StepOne";
import { StepTwo } from "@/components/form/steps/StepTwo";
import { StepThree } from "@/components/form/steps/StepThree";
import { StepFour } from "@/components/form/steps/StepFour";
import { StepFive } from "@/components/form/steps/StepFive";
import { StepSix } from "@/components/form/steps/StepSix";
import { StepSeven } from "@/components/form/steps/StepSeven";
import { StepEight } from "@/components/form/steps/StepEight";
import { StepNine } from "@/components/form/steps/StepNine";
import { useForm } from "@/contexts/FormContext";

const TOTAL_STEPS = 9;

export default function HomePage() {
  const { step, nextStep } = useForm();

  return (
    <Card className="max-w-4xl p-6">
      <form onSubmit={nextStep} className="space-y-6">
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

        <FormFooter />
      </form>
    </Card>
  );
}
