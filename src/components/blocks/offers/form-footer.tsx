import { Button } from "@/components/ui/button";

interface FormFooterProps {
  pending: boolean;
  isGenerated: boolean;
  goToNextStep: () => void;
  onPreviousClick?: () => void;
}

export const FormFooter = ({
  pending,
  isGenerated,
  goToNextStep,
  onPreviousClick,
}: FormFooterProps) => {
  return (
    <div className="flex justify-between">
      <div>
        {onPreviousClick && (
          <Button
            variant="outline"
            onClick={onPreviousClick}
            disabled={pending}
          >
            Précédent
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        {isGenerated && (
          <>
            {/* <Button
              type="submit"
              variant="outline"
              disabled={pending}
              loading={pending}
            >
              Régénérer
            </Button> */}

            <Button onClick={goToNextStep} disabled={pending}>
              Suivant
            </Button>
          </>
        )}

        {!isGenerated && (
          <Button type="submit" disabled={pending} loading={pending}>
            Suivant
          </Button>
        )}
      </div>
    </div>
  );
};
