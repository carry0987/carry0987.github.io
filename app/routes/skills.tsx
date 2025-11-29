import type { Route } from './+types/skills';
import { Cpu, Sparkles } from 'lucide-react';

export function meta({}: Route.MetaArgs) {
    return [{ title: 'Skills | Carry' }, { name: 'description', content: 'My technical skills and expertise' }];
}

const skillGroups = [
    {
        title: 'Frontend',
        skills: [
            { name: 'React', level: 90 },
            { name: 'TypeScript', level: 85 },
            { name: 'Tailwind CSS', level: 95 },
            { name: 'Next.js', level: 80 },
            { name: 'Framer Motion', level: 75 }
        ]
    },
    {
        title: 'Backend & Tools',
        skills: [
            { name: 'Node.js', level: 70 },
            { name: 'PHP', level: 85 },
            { name: 'PostgreSQL', level: 65 },
            { name: 'Docker', level: 60 },
            { name: 'Git', level: 90 }
        ]
    }
];

const additionalSkills = ['Responsive Design', 'Web Accessibility', 'SEO Optimization', 'CI/CD Pipelines'];

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {skillGroups.map((group, idx) => (
                    <div key={idx} className="space-y-6">
                        <h3 className="text-xl font-mono text-tech-400 flex items-center gap-2">
                            <Sparkles size={16} /> {group.title}
                        </h3>
                        <div className="space-y-4">
                            {group.skills.map((skill) => (
                                <div key={skill.name} className="group">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-slate-300 font-medium group-hover:text-white transition-colors">
                                            {skill.name}
                                        </span>
                                        <span className="text-slate-500 text-xs font-mono">{skill.level}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-linear-to-r from-tech-600 to-tech-400 rounded-full transform origin-left transition-transform duration-1000 ease-out group-hover:shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                                            style={{ width: `${skill.level}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
                {additionalSkills.map((item) => (
                    <div
                        key={item}
                        className="p-4 border border-white/5 bg-white/2 rounded-lg text-center text-sm text-slate-400 hover:border-tech-500/30 hover:bg-tech-500/5 transition-colors cursor-default font-mono">
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
}
