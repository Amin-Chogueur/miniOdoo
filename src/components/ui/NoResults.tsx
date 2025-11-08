"use client";

export default function NoResults({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
        {message}
      </h2>
    </div>
  );
}
