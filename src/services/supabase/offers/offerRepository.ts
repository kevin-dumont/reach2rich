"use server";

import { createClient } from "@/config/supabase/server";
import { Offer, OfferJson } from "@/types/offer";

export type OfferDTO = {
  id: string;
  name: string;
  created_at: string;
  offer_json: OfferJson;
  user_id: string;
};

const mapOfferDTOToOffer = (offerDTO: OfferDTO): Offer => {
  return {
    id: offerDTO.id,
    name: offerDTO.name,
    createdAt: offerDTO.created_at,
    offerJson: offerDTO.offer_json,
    userId: offerDTO.user_id,
  };
};

const mapOfferToOfferDTO = (offer: Partial<Offer>): Partial<OfferDTO> => {
  return {
    id: offer.id,
    name: offer.name,
    created_at: offer.createdAt,
    offer_json: offer.offerJson,
    user_id: offer.userId,
  };
};

export const fetchOffers = async (): Promise<Offer[] | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("offers")
    .select("*")
    .overrideTypes<OfferDTO[], { merge: false }>();

  if (error) {
    console.error("Error fetching offers:", error);
    return null;
  }

  return data.map(mapOfferDTOToOffer);
};

export const fetchOfferData = async (
  offerId: string
): Promise<Offer | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("offers")
    .select("*")
    .eq("id", offerId)
    .single();

  if (error || !data) {
    console.error("Error fetching offer data or offer not found:", error);
    return null;
  }

  return mapOfferDTOToOffer(data);
};

export const updateOffer = async (offer: Offer): Promise<Offer | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("offers")
    .update(mapOfferToOfferDTO(offer))
    .eq("id", offer.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating offer:", error);
    return null;
  }

  return mapOfferDTOToOffer(data);
};

export const createOffer = async (
  name: string,
  offerJson: Record<string, unknown>
) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("offers")
    .insert([
      {
        name,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        offer_json: offerJson,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating offer:", error);
    return null;
  }

  return mapOfferDTOToOffer(data);
};

export const deleteOffer = async (offerId: string) => {
  const supabase = await createClient();
  const { error } = await supabase.from("offers").delete().eq("id", offerId);

  if (error) {
    console.error("Error deleting offer:", error);
    return false;
  }

  return true;
};

export const duplicateOffer = async (offerId: string) => {
  const supabase = await createClient();
  const { data: offer, error } = await supabase
    .from("offers")
    .select("*")
    .eq("id", offerId)
    .single();

  if (error || !offer) {
    console.error("Error fetching offer for duplication:", error);
    return null;
  }

  const { data, error: insertError } = await supabase
    .from("offers")
    .insert([
      {
        name: `${offer.name} (Copy)`,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        offer_json: offer.offer_json,
      },
    ])
    .select();

  if (insertError) {
    console.error("Error duplicating offer:", insertError);
    return null;
  }

  return data;
};

export const renameOffer = async (offerId: string, newName: string) => {
  const supabase = await createClient();
  const { error } = await supabase
    .from("offers")
    .update({ name: newName })
    .eq("id", offerId);

  if (error) {
    console.error("Error renaming offer:", error);
    return false;
  }

  return true;
};
