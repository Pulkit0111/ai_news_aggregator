import Link from 'next/link';

type LogoProps = {
  variant?: 'default' | 'large';
  href?: string;
};

export default function Logo({ variant = 'default', href = '/' }: LogoProps) {
  const isLarge = variant === 'large';

  const content = (
    <div className={`flex items-center gap-2 ${isLarge ? 'gap-3' : 'gap-2'}`}>
      {/* Logo Icon */}
      <div className={`relative ${isLarge ? 'w-12 h-12' : 'w-10 h-10'}`}>
        <div className={`absolute inset-0 bg-gradient-to-br from-cyan-400 via-purple-400 to-pink-400 border-4 border-black ${isLarge ? 'shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' : 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            {/* AI Icon - stylized brain/circuit */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
              strokeWidth="2.5"
              className={isLarge ? 'w-7 h-7' : 'w-6 h-6'}
            >
              {/* Brain/Network representation */}
              <circle cx="12" cy="12" r="3" fill="black" />
              <circle cx="6" cy="8" r="2" fill="white" stroke="black" strokeWidth="2" />
              <circle cx="18" cy="8" r="2" fill="white" stroke="black" strokeWidth="2" />
              <circle cx="6" cy="16" r="2" fill="white" stroke="black" strokeWidth="2" />
              <circle cx="18" cy="16" r="2" fill="white" stroke="black" strokeWidth="2" />
              <line x1="8" y1="9" x2="10" y2="11" strokeWidth="2" />
              <line x1="16" y1="9" x2="14" y2="11" strokeWidth="2" />
              <line x1="8" y1="15" x2="10" y2="13" strokeWidth="2" />
              <line x1="16" y1="15" x2="14" y2="13" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>

      {/* Logo Text */}
      <div className="flex flex-col">
        <div className={`font-black tracking-tight leading-none ${isLarge ? 'text-4xl' : 'text-3xl'}`}>
          <span className="text-cyan-500">AI</span>
          <span className="text-black">BUZZ</span>
        </div>
        <div className={`font-bold text-black opacity-80 ${isLarge ? 'text-sm tracking-wider' : 'text-xs tracking-wide'}`}>
          NEWS INTELLIGENCE
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-80 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
