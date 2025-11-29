import type { Route } from './+types/skills';
import { Monitor, Database, Layers, Cpu } from 'lucide-react';

export function meta({}: Route.MetaArgs) {
    return [{ title: 'Skills | Carry' }, { name: 'description', content: 'My technical skills and expertise' }];
}

const skillCategories = [
    {
        title: 'Frontend Core',
        icon: <Monitor className="text-tech-400" />,
        skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'HTML5/CSS3', 'Redux/Zustand']
    },
    {
        title: 'Backend & Tools',
        icon: <Database className="text-purple-400" />,
        skills: ['Node.js', 'Express', 'PostgreSQL', 'Git/GitHub', 'Docker', 'Vite']
    },
    {
        title: 'UI/UX & Design',
        icon: <Layers className="text-pink-400" />,
        skills: ['Figma', 'Responsive Design', 'Framer Motion', 'Accessibility', 'Design Systems']
    }
];

export default function SkillsPage() {
    return (
        <div className="animate-slide-up w-full">
            <div className="flex items-center gap-4 mb-12">
                <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                    <span className="text-tech-400 font-mono">
                        <Cpu />
                    </span>{' '}
                    Technical Arsenal
                </h2>
                <div className="h-px bg-slate-800 grow max-w-xs"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skillCategories.map((cat, idx) => (
                    <div
                        key={idx}
                        className="glass-panel p-6 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-white/5 rounded-lg border border-white/10">{cat.icon}</div>
                            <h3 className="text-xl font-semibold text-slate-200">{cat.title}</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {cat.skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="px-3 py-1 text-sm rounded-md bg-slate-800/50 border border-slate-700 text-slate-300 hover:border-tech-500/50 hover:text-tech-400 transition-colors cursor-default">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 glass-panel p-8 rounded-2xl border border-tech-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-tech-500/10 blur-[80px] -z-10" />
                <h3 className="text-xl font-bold mb-4 text-white">Still Learning</h3>
                <p className="text-slate-400 max-w-2xl leading-relaxed">
                    Technology is advancing rapidly, and I am currently delving into <strong>Web3</strong> development
                    and <strong>AI model integration</strong>. I believe that maintaining curiosity is the most
                    important trait for an engineer.
                </p>
            </div>
        </div>
    );
}
