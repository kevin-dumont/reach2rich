import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createOffer } from "@/services/supabase/offers/offerRepository";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CreateOfferModalProps {
  open: boolean;
  onClose: () => void;
}

const CreateOfferModal: React.FC<CreateOfferModalProps> = ({
  open,
  onClose,
}) => {
  const [newOfferName, setNewOfferName] = useState("");
  const [pendingCreation, setPendingCreation] = useState(false);
  const router = useRouter();

  const handleCreateOffer = async () => {
    if (newOfferName.trim() === "") return;

    setPendingCreation(true);

    const data = await createOffer(newOfferName, {});

    if (data) {
      router.push(`/dashboard/offers/${data?.id}/edit`);

      toast.success("Offre créée avec succès");
    } else {
      toast.error("Erreur lors de la création de l'offre");
    }

    setPendingCreation(false);
    setNewOfferName("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer une offre</DialogTitle>
        </DialogHeader>
        <Input
          value={newOfferName}
          onChange={(e) => setNewOfferName(e.target.value)}
          placeholder="Nouveau nom de l'offre"
          className="mb-4"
        />
        <Button
          onClick={handleCreateOffer}
          className="w-full"
          loading={pendingCreation}
        >
          Créer
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOfferModal;
