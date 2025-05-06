"use server";

interface EnrollmentItem {
  id: number;
  accessType: string;
  active: boolean;
  contact: {
    id: number;
    email: string;
    registeredAt: string;
    locale: string;
    sourceURL: string;
    unsubscribed: boolean;
    bounced: boolean;
    needsConfirmation: boolean;
  };
  course: {
    id: number;
    locale: string;
    path: string;
    active: boolean;
    name: string;
  };
}

interface ApiResponse {
  items: EnrollmentItem[];
}

const Reach2RichCourseId = 412356;

export const checkUserHasCourseByContactId = async (
  contactId: string
): Promise<boolean> => {
  try {
    const response = await fetch(
      `https://api.systeme.io/api/school/enrollments?contact=${contactId}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "X-API-Key": process.env.SYSTEME_IO_API_KEY as string,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data: ApiResponse = await response.json();

    const Reach2RichCourse = data.items.find(
      (item) => item.course.id === Reach2RichCourseId
    );

    if (!Reach2RichCourse) {
      return false;
    }

    return (
      Reach2RichCourse.active && Reach2RichCourse.accessType === "full_access"
    );
  } catch (error) {
    console.error("Failed to fetch enrollments:", error);
    return false;
  }
};
