import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { useForm } from "@/contexts/FormContext";

export function FormFooter() {
  const {
    loading,
    nextStep,
    previousStep,
    regenerateStep,
    isLastStep,
    canGoBack,
    canRegenerate,
    finish,
  } = useForm();

  return (
    <div className="flex justify-between">
      {canGoBack && (
        <Button
          type="button"
          variant="outline"
          onClick={previousStep}
          disabled={loading}
        >
          Précédent
        </Button>
      )}

      <div className="flex gap-2 ml-auto">
        {canRegenerate && (
          <Button
            type="button"
            variant="outline"
            onClick={regenerateStep}
            disabled={loading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Re-générer
          </Button>
        )}

        {!isLastStep && (
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traitement en cours...
              </>
            ) : (
              "Suivant"
            )}
          </Button>
        )}

        {isLastStep && (
          <Button type="button" onClick={finish}>
            Terminer
          </Button>
        )}
      </div>
    </div>
  );
}
