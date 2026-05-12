import React, { useEffect, type JSX } from "react";
import type { Route } from "../+types/root";
import { usePuterStore } from "~/lib/puter";
import { useLocation, useNavigate } from "react-router";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResumeInd |  Auth" },
    { name: "description", content: "LogIn into App" },
  ];
}
const Auth: () => JSX.Element = () => {
  const { isLoading, auth } = usePuterStore();
  const location: any = useLocation();
  const next: string = location.search.split("next=")[1];
  console.log(next, 'location.search.split("next=")', location);
  const navigate = useNavigate();
  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate(next);
    }
  }, [auth.isAuthenticated, next]);
  return (
    <main className="bg-[url('images/bg-main.svg')] bg-cover flex items-center justify-center">
      <div className="gradient-border shadow-lg">
        <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1>Welcome</h1>
            <h2>Log In to continue your Job</h2>
          </div>
          <div>
            {isLoading ? (
              <button className="auth-button animate-pulse">
                <p>Signing You in ...</p>
              </button>
            ) : (
              <>
                {auth.isAuthenticated ? (
                  <button className="auth-button" onClick={auth.signOut}>
                    Log Out
                  </button>
                ) : (
                  <button className="auth-button" onClick={auth.signIn}>
                    Log In
                  </button>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Auth;
