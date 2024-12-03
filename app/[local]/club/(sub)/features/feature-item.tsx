
export default function FeatureItem({title, className, children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={`mt-5 flex  w-full flex-col items-start justify-start rounded-[20px] bg-[rgba(255,255,255,0.1)] p-[20px] backdrop-blur-md ${className}`}>
      <div className="text-[20px] md:text-base  font-semibold md:font-medium leading-6 text-[#D6D6D6]">
        {title}
      </div>
      <div className="md:mt-[10px] flex items-center justify-between self-stretch">
        {children}
      </div>
    </div>
  );
}