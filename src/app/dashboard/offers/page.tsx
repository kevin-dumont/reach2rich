"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { FileEdit, MoreHorizontal, Copy, Trash } from "lucide-react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  deleteOffer,
  duplicateOffer,
  fetchOffers,
  renameOffer,
} from "@/services/supabase/offers/offerRepository";
import { Offer } from "@/types/offer";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import CreateOfferModal from "@/components/blocks/offers/create-offer-modal";

export default function ListeOffres() {
  const { user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [newOfferName, setNewOfferName] = useState("");
  const [loading, setLoading] = useState(true);
  const [offerToDelete, setOfferToDelete] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [offerToRename, setOfferToRename] = useState<Offer | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);

    fetchOffers()
      .then((offers) => {
        if (offers) {
          setOffers(offers);
        }
      })
      .catch((error) => {
        console.error("Error fetching offers:", error);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleConfirmDelete = async () => {
    if (offerToDelete === null) return;

    const success = await deleteOffer(offerToDelete);

    if (success) {
      setOffers((prevOffers) =>
        prevOffers.filter((offer) => offer.id !== offerToDelete)
      );
      toast.success("Projet supprimé avec succès");
    } else {
      toast.error("Erreur lors de la suppression du projet");
    }

    setOfferToDelete(null);
    setShowDeleteDialog(false);
  };

  const handleDuplicateOffer = async (offerId: number) => {
    const data = await duplicateOffer(offerId);

    if (data) {
      setOffers((prevOffers) => [...prevOffers, ...data]);
      toast.success("Projet dupliqué avec succès");

      if (data.length > 0) {
        router.push(`/offers/${data[0].id}`);
      }
    } else {
      toast.error("Erreur lors de la duplication du projet");
    }
  };

  const handleOfferAction = async () => {
    if (offerToRename) {
      const success = await renameOffer(offerToRename.id, newOfferName);

      if (success) {
        setOffers((prevOffers) =>
          prevOffers.map((offer) =>
            offer.id === offerToRename.id
              ? { ...offer, name: newOfferName }
              : offer
          )
        );
        toast.success("Projet renommé avec succès");
      } else {
        toast.error("Erreur lors de la renommation du projet");
      }
    }

    setOfferToRename(null);
    setNewOfferName("");
    setShowRenameDialog(false);
  };

  return (
    <div className="p-6">
      <div className="text-2xl font-bold">Mes offres</div>

      <div className="mt-4">
        {loading ? (
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-[140px] flex flex-col justify-center"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {offers.map((offer) => (
              <div key={offer.id} className="relative group">
                <Link
                  href={`/dashboard/offers/${offer.id}`}
                  className="block h-full"
                >
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow h-[140px]">
                    <h3 className="font-medium">{offer.name}</h3>
                  </div>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="absolute top-2 right-2 bg-transparent text-gray-500 hover:text-gray-700 focus:outline-none"
                      aria-label="Project Actions"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onSelect={() => {
                        setOfferToRename(offer);
                        setNewOfferName(offer.name);
                        setShowRenameDialog(true);
                      }}
                      className="hover:text-blue-700 flex justify-between"
                    >
                      Renommer
                      <FileEdit className="h-4 w-4 ml-2" />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => handleDuplicateOffer(offer.id)}
                      className="hover:text-blue-700 flex justify-between"
                    >
                      Dupliquer
                      <Copy className="h-4 w-4 ml-2" />
                    </DropdownMenuItem>
                    <div className="border-t border-gray-200 my-1"></div>
                    <DropdownMenuItem
                      onSelect={() => {
                        setOfferToDelete(offer.id);
                        setShowDeleteDialog(true);
                      }}
                      className="text-red-500 hover:text-red-700 flex justify-between"
                    >
                      Supprimer
                      <Trash className="h-4 w-4 ml-2 text-red-500" />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}

            {/* Add Project Button */}
            <button
              onClick={() => setShowCreateDialog(true)}
              className="h-[140px] rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
            >
              <Plus className="h-8 w-8 text-gray-400" />
            </button>
          </div>
        )}
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la Suppression</DialogTitle>
          </DialogHeader>
          <p>
            Êtes-vous sûr de vouloir supprimer cette offre ? Cette action est
            irréversible.
          </p>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setShowDeleteDialog(false)} className="mr-2">
              Annuler
            </Button>
            <Button
              onClick={handleConfirmDelete}
              className="bg-red-500 text-white"
            >
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renommer l&apos;offre</DialogTitle>
          </DialogHeader>
          <Input
            value={newOfferName}
            onChange={(e) => setNewOfferName(e.target.value)}
            placeholder="Nouveau nom de l'offre"
            className="mb-4"
          />
          <Button onClick={handleOfferAction} className="w-full">
            Renommer
          </Button>
        </DialogContent>
      </Dialog>

      <CreateOfferModal
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      />
    </div>
  );
}
