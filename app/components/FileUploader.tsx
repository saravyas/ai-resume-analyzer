import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "~/lib/utils";
interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}
const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file: File = acceptedFiles[0] || null;
    onFileSelect?.(file);
  }, []);
  const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: { "application/pdf": [".pdf"] },
      maxSize: maxFileSize,
    });
  const file = acceptedFiles[0] || null;
  return (
    <div className="w-full gradient-border">
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="space-y-4 cursor-pointer">
          {file ? (
            <div
              className="uploader-select-file"
              onClick={(e) => e.stopPropagation()}
            >
              <img src="/images/pdf.png" className="size-10" alt="pdf" />
              <div className="text-center flex space-x-3">
                <p className="text-sm text-gray-700 truncate font-medium max-w-xs">
                  {file.name}
                </p>
                <p className="text-sm text-gray-500">{formatSize(file.size)}</p>
              </div>
              <button
                className="p-2 cursor-pointer "
                onClick={(e) => {
                  onFileSelect?.(file);
                }}
              >
                <img src="icons/cross.svg" alt="remove" className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <div className="mx-auto w-16 h-16 flex item-center justify-center mb-2">
                <img src="/icons/info.svg" className="size-20" alt="upload" />
              </div>
              <p className="text-lg text-gray-500">
                <span className="font-semibold">Click to upload</span>or drag
                abd drop
              </p>
              <p className="text-lg text-gray-500">
                Pdf max(upto {formatSize(maxFileSize)})
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
