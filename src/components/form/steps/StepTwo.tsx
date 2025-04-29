import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@/contexts/FormContext";

export function StepTwo() {
  const { formData, updateFormData } = useForm();

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Résultat de l&apos;étape 1
        </label>
        <Textarea
          className="mt-2"
          value={formData.stepOneResult}
          onChange={(e) => updateFormData({ stepOneResult: e.target.value })}
          rows={8}
        />
      </div>
      <div>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Votre CV
        </label>
        <Textarea
          className="mt-2"
          value={formData.cv}
          onChange={(e) => updateFormData({ cv: e.target.value })}
          rows={8}
        />
      </div>
    </div>
  );
}
