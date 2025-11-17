interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <section className="bg-[#f44336] bg-opacity-10 border-l-4 border-[#f44336] rounded-lg p-4 mb-4">
      <div className="flex items-start">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#f44336] mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <div>
          <h3 className="font-bold text-[#f44336]">Error</h3>
          <p className="text-neutral-400">{message}</p>
        </div>
      </div>
    </section>
  );
}
