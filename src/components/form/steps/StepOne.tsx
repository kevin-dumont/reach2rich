import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@/contexts/FormContext";

export function StepOne() {
  const { formData, updateFormData } = useForm();

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Quelle est votre offre ? Qu&apos;est-ce que vous vendez et à qui ?
          Combien ?
        </label>
        <Textarea
          className="mt-2 min-h-60 placeholder:text-gray-400/60"
          value={formData.offer}
          onChange={(e) => updateFormData({ offer: e.target.value })}
          rows={4}
          placeholder={`Exemple : "J'aide les développeurs à trouver une mission en freelance grâce à la méthode Reach2Rich.
Il s'agit d'une méthode pratiquement 100% asynchrone pour un prix de 1000€ HT."`}
        />
      </div>
      <div>
        <label
          htmlFor="steps"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Quel est le déroulé de votre offre ? (Étape 1 ; Étape 2 ; Étape 3 ;
          ...)
        </label>
        <Textarea
          id="steps"
          name="steps"
          placeholder={`Exemple : "Étape 1 : On refait votre offre.
Étape 2 : On refait votre profil LinkedIn.
Étape 3 : On crée votre ligne éditoriale.
Étape 4 : On vous apprend à créer des posts qui convertissent."`}
          className="mt-2 min-h-60 placeholder:text-gray-400/60"
          value={formData.steps}
          onChange={(e) => updateFormData({ steps: e.target.value })}
          rows={4}
        />
      </div>
    </div>
  );
}
