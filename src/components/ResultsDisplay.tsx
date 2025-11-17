import { WasteCategory } from "@shared/schema";

interface ResultsDisplayProps {
  category: WasteCategory;
}

export default function ResultsDisplay({ category }: ResultsDisplayProps) {
  return (
    <section className="bg-white rounded-lg p-6 shadow-lg mb-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 text-neutral-400">Classification Result</h2>
        <div className="flex flex-col items-center justify-center">
          <div className="w-24 h-24 mb-4 flex items-center justify-center">
            {/* Dynamically render the appropriate icon based on category */}
            {category === 'plastic' && (
              <svg width="80" height="80" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 38H10V13.83C10 13.3 10.21 12.79 10.59 12.41L20 3L22 5C22.29 5.29 22.29 5.74 22 6.03L14 13.83V38Z" fill="#4CAF50" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M30 38V10H34.4C35.3 10 36.1 10.4 36.7 11L42.6 15.8C43.4 16.4 43.9 17.2 43.9 18.1C43.9 19.1 43 19.8 42.1 19.4L36 17V38H30Z" fill="#4CAF50" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 38V4H26V38H22Z" fill="#4CAF50" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {category === 'paper' && (
              <svg width="80" height="80" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M40 45H8C6.9 45 6 44.1 6 43V5C6 3.9 6.9 3 8 3H30L42 15V43C42 44.1 41.1 45 40 45Z" fill="#4CAF50" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M30 3L42 15H30V3Z" fill="#4CAF50" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 22H32" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 30H32" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 38H32" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {category === 'glass' && (
              <svg width="80" height="80" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M34 13L31 43H17L14 13H34Z" fill="#4CAF50" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M37 13H11L14 5H34L37 13Z" fill="#4CAF50" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 21L19 35" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M31 21L29 35" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {category === 'metal' && (
              <svg width="80" height="80" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="15" width="38" height="25" rx="2" fill="#4CAF50" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 15V11C16 8.79086 17.7909 7 20 7H28C30.2091 7 32 8.79086 32 11V15" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 28H34" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 22H34" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 34H34" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {category === 'organic' && (
              <svg width="80" height="80" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 44C24 44 37 35 37 22C37 17.2261 35.1036 12.6477 31.7279 9.27208C28.3523 5.89642 23.7739 4 19 4C14.2261 4 9.64773 5.89642 6.27208 9.27208C2.89642 12.6477 1 17.2261 1 22C1 35 14 44 14 44" fill="#4CAF50" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M24 44C24 38.47 27.6 29.22 33.24 29.22C38.88 29.22 44 35 44 42" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 22C12 22 17 20 24 29C31 38 36 36 36 36" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <p className="text-3xl font-bold uppercase tracking-wider text-primary">{category}</p>
          <p className="mt-4 text-lg text-neutral-300">Please place this item in the appropriate bin</p>
        </div>
      </div>
    </section>
  );
}
