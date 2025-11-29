import type { Route } from './+types/_index';
import { Link } from 'react-router';
import { Mail, ArrowRight } from 'lucide-react';
import { GithubIcon, LinkedInIcon } from '@/component/ui/icons';
import { Typewriter, SocialLink } from '@/component/ui';

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Carry's Profile | Developer Portfolio" },
        { name: 'description', content: 'Full Stack Developer - Building Digital Experiences' }
    ];
}

export default function IndexPage() {
    return (
        <div className="flex flex-col justify-center min-h-[60vh] animate-fade-in">
            <div className="space-y-8 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-tech-500/10 border border-tech-500/20 text-tech-400 text-xs font-mono mb-4">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tech-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-tech-500"></span>
                    </span>
                    System Online
                </div>

                <h1 className="text-4xl md:text-7xl font-bold leading-tight tracking-tight text-white">
                    Hi, I'm <span className="text-white">Carry</span>.
                    <br />
                    I build <Typewriter texts={['Digital Experiences.', 'Web Applications.', 'Scalable Systems.']} />
                </h1>

                <p className="text-slate-400 text-base md:text-lg max-w-2xl leading-relaxed border-l-2 border-tech-500/30 pl-6 py-2">
                    A programmer who is passionate about Deep Learning and open source. Using C, C++, JS/TS, PHP,
                    Python, Go, Swift, Rust
                </p>

                <div className="flex flex-wrap gap-4 pt-6">
                    <Link
                        to="/projects"
                        className="group relative px-8 py-3 bg-white text-dark-bg rounded-lg font-bold transition-all hover:bg-tech-50 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2 overflow-hidden">
                        <span className="relative z-10 flex items-center gap-2">
                            View Projects{' '}
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Link>
                    <Link
                        to="/contact"
                        className="px-8 py-3 bg-transparent border border-slate-700 text-slate-300 rounded-lg font-medium transition-all hover:border-tech-400 hover:text-tech-400 hover:bg-tech-950/30">
                        Contact Me
                    </Link>
                </div>

                <div className="pt-12 flex gap-4">
                    <SocialLink href="https://github.com/carry0987" icon={GithubIcon} label="GitHub" />
                    <SocialLink href="https://www.linkedin.com/in/carry0987" icon={LinkedInIcon} label="LinkedIn" />
                    <SocialLink href="mailto:carry0987@gmail.com" icon={Mail} label="Email" />
                </div>
            </div>
        </div>
    );
}
