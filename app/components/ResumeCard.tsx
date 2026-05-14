import React, { useEffect, useState, type JSX } from "react";
import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";
import { usePuterStore } from "~/lib/puter";

const ResumeCard: ({ resume }: { resume: Resume }) => JSX.Element = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
}: {
  resume: Resume;
}) => {
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState<string>("");
  useEffect(() => {
    const loadResumes: () => Promise<void> = async () => {
      const blob = await fs.read(imagePath);
      if (!blob) {
        return;
      }
      let url = URL.createObjectURL(blob);
      setResumeUrl(url);
    };
    loadResumes();
  }, [imagePath]);
  return (
    <Link
      className="resume-card animate-in fade-in duration-1000"
      to={`/resume/${id}`}
    >
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          {companyName && (
            <h2 className="!text-black font-bold break-words">{companyName}</h2>
          )}
          {jobTitle && (
            <h3 className="!text-lg text-gray-500 break-words">{jobTitle}</h3>
          )}
          {!companyName && !jobTitle && (
            <h2 className="!text-black font-bold"></h2>
          )}
        </div>
        <div className="flex-shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>
      {resumeUrl && (
        <div className="gradient-border animate-in fade-in duration-1000">
          <div className="w-full h-full">
            <img
              src={resumeUrl}
              alt="resume"
              className="w-full h-[350px] max-sm:h-[200px] object-cover"
            />
          </div>
        </div>
      )}
    </Link>
  );
};

export default ResumeCard;
