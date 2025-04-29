import { checkUserHasCourseByEmail } from "@/services/systeme.io/checkUserHasCourseByEmail";
import { createServerClient } from "@supabase/ssr";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const { supabase, response, user } = await authenticateUser(request);

  const pathname = request.nextUrl.pathname;

  const redirect = (path: string) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    return NextResponse.redirect(url);
  };

  if (pathname === "/") {
    return redirect("/dashboard/offers");
  }

  if (!user) {
    if (pathname === "/login") {
      return response;
    }
    return redirect("/login");
  }

  const isVerified = await isUserVerified(supabase, user);

  if (!isVerified) {
    if (pathname === "/not-authorized") {
      return response;
    }
    return redirect("/not-authorized");
  }

  if (pathname === "/login") {
    return redirect("/dashboard/offers");
  }

  return response;
}

async function isUserVerified(supabase: SupabaseClient, currentUser: User) {
  const userEmail = currentUser?.email;
  const isUnverifiedUser = !currentUser?.user_metadata?.verified;

  if (!isUnverifiedUser) {
    return true;
  }

  if (!userEmail || !(await checkUserHasCourseByEmail(userEmail))) {
    return false;
  }

  await supabase.auth.updateUser({
    data: { verified: true },
  });

  return true;
}

const authenticateUser = async (request: NextRequest) => {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );

          response = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, response, user };
};
