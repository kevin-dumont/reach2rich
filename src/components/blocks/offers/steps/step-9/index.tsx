import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@/contexts/form-context";
import { useActionState } from "react";
import { generateStepNine, StepNineResponse } from "./actions";
import { Label } from "@/components/ui/label";
import { FormFooter } from "@/components/blocks/offers/form-footer";
import { cn } from "@/lib/utils";
import { useStepAction } from "@/hooks/use-step-action";
import { FormMessage } from "@/components/blocks/offers/form-message";

const initialState: StepNineResponse = {};

export function StepNine() {
  const { offer, setStep, isLoading } = useForm();

  const onSubmit = useStepAction(generateStepNine);

  const [state, formAction, pending] = useActionState(onSubmit, initialState);

  return (
    <form action={formAction}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="painPoints">Tu te reconnais là dedans ?</Label>
          <Textarea
            rows={12}
            name="painPoints"
            loading={isLoading}
            defaultValue={offer?.offerJson.generated.painPoints}
            className={cn("mt-2 min-h-60", {
              "border-red-500": state?.inputErrors?.painPoints,
            })}
          />
          <FormMessage error={state?.inputErrors?.painPoints} />
        </div>

        <FormFooter
          pending={pending}
          onPreviousClick={() => setStep(8)}
          isGenerated={!!offer?.offerJson?.generated?.doNothing}
          goToNextStep={() => setStep(10)}
        />
      </div>
    </form>
  );
}
