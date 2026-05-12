import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "~/constants";
import ResumeCard from "~/components/ResumeCard";
import { useEffect } from "react";
import { usePuterStore } from "~/lib/puter";
import { useNavigate, type NavigateFunction } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resume Analyzer" },
    { name: "description", content: "Resume Analyzer" },
  ];
}

export default function Home() {
  const { auth } = usePuterStore();
  const navigate: NavigateFunction = useNavigate();
  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/auth?next=/");
    }
  }, [auth.isAuthenticated]);
  return (
    <main className="bg-[url('images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track your Resume Application and Resume Ratings</h1>
          <h2>Review your submission and check AI feedback</h2>
        </div>
        {resumes.length > 0 &&
          resumes.map((data) => <ResumeCard key={data.id} resume={data} />)}
      </section>
    </main>
  );
}
