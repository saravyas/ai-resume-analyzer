import React, { useState, type JSX } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { prepareInstructions } from "~/constants";
import { convertPdfToImage } from "~/lib/pdf2img";
import { usePuterStore } from "~/lib/puter";
import { generateUUID } from "~/lib/utils";

const Upload: () => JSX.Element = () => {
  const [isProcesssing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { fs, ai, kv, isLoading, auth } = usePuterStore();
  let navigate = useNavigate();

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    setIsProcessing(true);
    setStatusText("Uploading File...");
    const uploadedFile: FSItem | undefined = await fs.upload([file]);
    if (!uploadedFile) {
      return setStatusText("Error in upload file");
    }
    setStatusText("Converting pdf to img");
    const imageFile = await convertPdfToImage(file);
    if (!imageFile.file) {
      return setStatusText("Error in covert file");
    }
    setStatusText("Uploading Image...");
    const uploadedImage = await fs.upload([imageFile.file]);
    if (!uploadedImage) return setStatusText("Error: Failed to upload image");
    setStatusText("Preparing data...");

    const id = generateUUID();
    const data = {
      id,
      companyName,
      jobTitle,
      jobDescription,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      feedback: "",
    };
    await kv.set(`resume:${id}`, JSON.stringify(data));
    setStatusText("Analysising Resume");
    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({ jobTitle, jobDescription }),
    );
    if (!feedback) {
      setStatusText("Error in Failed to ananlyze resume");
    }
    const feedbackText =
      typeof feedback?.message.content === "string"
        ? feedback.message.content
        : feedback?.message.content[0].text;
    data.feedback = JSON.parse(feedbackText);
    await kv.set(`resume:${id}`, JSON.stringify(data));
    setStatusText("Analysising Resume DOne");
    navigate(`/resume/${id}`);
    console.log(data);
  };

  const handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void = (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) {
      return;
    }
    const formData = new FormData(form);
    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    console.log("message", { companyName, jobTitle, jobDescription, file });
    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };
  const onFileSelect: (file: File | null) => void = (file: File | null) => {
    setFile(file);
  };
  return (
    <main className="bg-[url('images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Smart Feedback for your dream job</h1>
        </div>
        {isProcesssing ? (
          <>
            <h2>{statusText}</h2>
            <img src="images/resume-scan.gif" className="w-full" />
          </>
        ) : (
          <>
            <h2>Drop your resume for an ATS score and improvement tips</h2>
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 mt-8"
            >
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input
                  type="text"
                  name="company-name"
                  placeholder="company Name"
                  id="company-name"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input
                  type="text"
                  name="job-title"
                  placeholder="Job Title"
                  id="job-title"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-description">Job Title</label>
                <textarea
                  rows={5}
                  name="job-description"
                  placeholder="Job Description"
                  id="job-description"
                />
              </div>
              <div className="form-div">
                <label htmlFor="uploader">Uplaod Resume</label>
                <div>
                  <FileUploader onFileSelect={onFileSelect} />
                </div>
              </div>
              <button className="primary-button" type="submit">
                Analyse Resume
              </button>
            </form>
          </>
        )}
      </section>
    </main>
  );
};

export default Upload;
