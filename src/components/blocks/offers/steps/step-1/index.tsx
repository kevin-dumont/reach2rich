import { useActionState } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@/contexts/form-context";
import { Label } from "@/components/ui/label";
import { FormFooter } from "@/components/blocks/offers/form-footer";
import { FormMessage } from "@/components/blocks/offers/form-message";
import { useStepAction } from "@/hooks/use-step-action";
import { generateStepOne, StepOneResponse } from "./actions";

const initialState: StepOneResponse = {};

const offerPlaceholder = `Exemple : "J'aide les développeurs à trouver une mission en freelance grâce à la méthode Reach2Rich.
Il s'agit d'une méthode pratiquement 100% asynchrone pour un prix de 1000€ HT."`;

const stepsPlaceholder = `Exemple : "Étape 1 : On refait votre offre.
Étape 2 : On refait votre profil LinkedIn.
Étape 3 : On crée votre ligne éditoriale.
Étape 4 : On vous apprend à créer des posts qui convertissent."`;

export function StepOne() {
  const { offer, setStep, isLoading } = useForm();

  const onSubmit = useStepAction(generateStepOne);

  const [state, formAction, pending] = useActionState(onSubmit, initialState);

  return (
    <form action={formAction}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="offer">
            Quelle est votre offre ? Qu&apos;est-ce que vous vendez et à qui ?
            Combien ?
          </Label>
          <Textarea
            rows={4}
            name="offer"
            defaultValue={offer?.offerJson?.userInput?.offer ?? ""}
            placeholder={offerPlaceholder}
            loading={isLoading}
            className={cn("mt-2 min-h-60 placeholder:text-gray-400/60", {
              "border-red-500": state.inputErrors?.offer,
            })}
          />
          <FormMessage error={state.inputErrors?.offer} />
        </div>

        <div>
          <Label htmlFor="steps">
            Quel est le déroulé de votre offre ? (Étape 1 ; Étape 2 ; ...)
          </Label>
          <Textarea
            rows={4}
            id="steps"
            name="steps"
            defaultValue={offer?.offerJson?.userInput?.steps ?? ""}
            placeholder={stepsPlaceholder}
            loading={isLoading}
            className={cn("mt-2 min-h-60 placeholder:text-gray-400/60", {
              "border-red-500": state.inputErrors?.steps,
            })}
          />
          <FormMessage error={state.inputErrors?.steps} />
        </div>

        <FormFooter
          pending={pending}
          isGenerated={!!offer?.offerJson?.generated?.steps}
          goToNextStep={() => setStep(2)}
        />
      </div>
    </form>
  );
}
