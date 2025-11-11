"use client";
import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

type SignaturePadProps = {
  onEnd: (data: string) => void;
};

export default function SignaturePad({ onEnd }: SignaturePadProps) {
  const sigCanvas = useRef<SignatureCanvas | null>(null);

  const handleEnd = () => {
    if (sigCanvas.current) {
      const dataURL = sigCanvas.current.toDataURL();
      //   const dataURL = canvas.toDataURL("image/png");
      onEnd(dataURL);
    }
  };

  const handleClear = () => {
    sigCanvas.current?.clear();
    onEnd(""); // clear signature from parent state
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <SignatureCanvas
        ref={sigCanvas}
        penColor="red"
        onEnd={handleEnd}
        canvasProps={{
          width: 300,
          height: 200,
          className: " rounded-md bg-white shadow-sm cursor-crosshair",
        }}
      />
      <button
        type="button"
        onClick={handleClear}
        className="mt-2 px-3 py-1 text-sm rounded text-white bg-red-500 hover:bg-red-600"
      >
        Clear
      </button>
    </div>
  );
}
