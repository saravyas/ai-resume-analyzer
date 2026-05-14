import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate, type NavigateFunction } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resume Analyzer" },
    { name: "description", content: "Resume Analyzer" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState<Boolean>(false);

  const navigate: NavigateFunction = useNavigate();
  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/auth?next=/");
    }
  }, [auth.isAuthenticated]);
  useEffect(() => {
    const loadResumes: () => Promise<void> = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list("resume:*", true)) as unknown as KVItem;

      const parsedResumes = resumes?.map((data: { value: string }) => {
        return JSON.parse(data.value) as Resume;
      });
      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    };
    loadResumes();
  }, []);

  return (
    <main className="bg-[url('images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track your Resume Application and Resume Ratings</h1>
          {!loadingResumes && resumes.length > 0 ? (
            <h2>No Resumes Found !upload your first resume to get feedback</h2>
          ) : (
            <h2>Review your submission and check AI feedback</h2>
          )}
        </div>
        {loadingResumes && (
          <div className="flex flex-col justify-center items-center">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" />
          </div>
        )}
        {!loadingResumes &&
          resumes.length > 0 &&
          resumes.map((data) => <ResumeCard key={data.id} resume={data} />)}
        {!loadingResumes && resumes.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10">
            <Link
              to="upload"
              className="primary-button w-fit text-xl font-semibold"
            >
              Upliad Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
