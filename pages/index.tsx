import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Home: NextPage = () => {
  const router = useRouter();

  // Redirect the user to the /register page.
  useEffect(() => {
    router.push("/register");
  }, [router]);

  return null;
};

export default Home;
