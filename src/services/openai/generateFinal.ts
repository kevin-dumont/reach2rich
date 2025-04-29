"use server";

export async function generateFinal(
  deroule: string,
  quiSuisJe: string,
  inNotIn: string,
  pourToiOuNon: string,
  questions: string,
  douleurs: string,
  prixVsCouts: string
) {
  return `${douleurs}

${quiSuisJe}

${pourToiOuNon}

${deroule}

${inNotIn}

${prixVsCouts}

${questions}`;
}
