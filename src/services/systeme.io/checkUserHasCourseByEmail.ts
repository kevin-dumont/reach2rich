import { checkUserHasCourseByContactId } from "./checkUserHasCourseByContactId";
import { fetchContactsByEmail } from "./fetchContactId";

export const checkUserHasCourseByEmail = async (email: string) => {
  const user = await fetchContactsByEmail(email);

  if (!user) {
    return false;
  }

  return checkUserHasCourseByContactId(user.id);
};
