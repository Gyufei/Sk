
export default function FeatureItem({title, className, children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={`mt-5 flex sm:h-[180px] w-full flex-col items-start justify-start rounded-[20px] bg-[rgba(255,255,255,0.1)] p-6 backdrop-blur-md ${className}`}>
      <div className="sm:mt-5 text-base font-medium leading-6 text-[#D6D6D6]">
        {title}
      </div>
      <div className="md:mt-[10px] flex items-center justify-between self-stretch">
        {children}
      </div>
    </div>
  );
}