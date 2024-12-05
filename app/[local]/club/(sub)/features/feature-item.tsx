
export default function FeatureItem({title, className, children }: { title: React.ReactNode; className?: string; children: React.ReactNode }) {
  // backdrop-blur-md
  return (
    <div className={`mt-5 flex  w-full flex-col items-start justify-start rounded-[20px] bg-[rgba(255,255,255,0.1)] p-[20px] bg-blur-12 ${className}`}>
      <div className="text-[20px] sm:text-base  font-semibold sm:font-medium leading-6 text-[#D6D6D6]">
        {title}
      </div>
      <div className="sm:mt-[10px] flex items-center justify-between self-stretch">
        {children}
      </div>
    </div>
  );
}