import { GithubIcon, LinkedInIcon } from '@/components/icons';

export const Footer = () => (
    <footer className="py-8 mt-auto border-t border-dark-border/50 bg-dark-bg/80 backdrop-blur text-center">
        <div className="flex justify-center gap-6 mb-4">
            <a
                href="https://github.com/carry0987"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-tech-400 transition-colors">
                <GithubIcon size={18} />
            </a>
            <a
                href="https://www.linkedin.com/in/carry0987"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-tech-400 transition-colors">
                <LinkedInIcon size={18} />
            </a>
        </div>
        <p className="text-slate-600 text-xs font-mono">git commit -m "Build with React & Tailwind"</p>
    </footer>
);
