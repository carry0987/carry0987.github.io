import type { Route } from './+types/projects';
import { Code2, ExternalLink, Command } from 'lucide-react';

export function meta({}: Route.MetaArgs) {
    return [{ title: 'Projects | Carry' }, { name: 'description', content: 'A list of my projects' }];
}

const projects = [
    {
        title: 'TemplateEngine',
        desc: 'A lightweight and fast PHP template engine with caching abilities, template inheritance, and Redis/MySQL support.',
        tech: ['PHP', 'Composer', 'Redis'],
        type: 'Backend',
        link: 'https://github.com/carry0987/TemplateEngine'
    },
    {
        title: 'MessageBoard',
        desc: 'A simple messageboard using PHP, mysqli, and JavaScript.',
        tech: ['PHP', 'MySQL', 'JS'],
        type: 'Web',
        link: 'https://github.com/carry0987/MessageBoard'
    },
    {
        title: 'Raspberry-Pi-Repo',
        desc: 'The repository for Raspberry Pi with various tools and scripts.',
        tech: ['Shell', 'Linux', 'ARM'],
        type: 'DevOps',
        link: 'https://github.com/carry0987/Raspberry-Pi-Repo'
    },
    {
        title: 'Imgur-Upload',
        desc: 'Pure JavaScript image upload to Imgur, no jQuery or PHP needed.',
        tech: ['JavaScript', 'API', 'HTML5'],
        type: 'Frontend',
        link: 'https://github.com/carry0987/Imgur-Upload'
    },
    {
        title: 'CKEditor-Imgur',
        desc: 'A plugin for CKEditor to upload images directly to Imgur.',
        tech: ['JavaScript', 'CKEditor', 'API'],
        type: 'Plugin',
        link: 'https://github.com/carry0987/CKEditor-Imgur'
    },
    {
        title: 'Web-Musicbox',
        desc: 'HTML5 music player with playlist and cover display functionality.',
        tech: ['HTML5', 'CSS', 'JavaScript'],
        type: 'Web',
        link: 'https://github.com/carry0987/Web-Musicbox'
    }
];

export default function ProjectsPage() {
    return (
        <div className="animate-slide-up">
            <div className="flex items-center gap-4 mb-12">
                <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                    <span className="text-tech-400 font-mono">
                        <Code2 />
                    </span>{' '}
                    Featured Projects
                </h2>
                <div className="h-px bg-slate-800 grow max-w-xs"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project, idx) => (
                    <a
                        key={idx}
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        className="group relative bg-dark-card/50 border border-white/5 rounded-2xl overflow-hidden hover:border-tech-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.2)] flex flex-col h-full">
                        <div className="p-8 flex flex-col grow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-tech-500/10 rounded-lg text-tech-400 group-hover:scale-110 transition-transform duration-300">
                                    <Command size={24} />
                                </div>
                                <ExternalLink
                                    size={20}
                                    className="text-slate-500 group-hover:text-white transition-colors"
                                />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-tech-400 transition-colors">
                                {project.title}
                            </h3>

                            <p className="text-slate-400 text-sm leading-relaxed mb-6 grow">{project.desc}</p>

                            <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                                {project.tech.map((t) => (
                                    <span
                                        key={t}
                                        className="text-xs font-mono text-slate-500 group-hover:text-tech-400/80 transition-colors">
                                        #{t}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Hover Gradient Overlay */}
                        <div className="absolute inset-0 bg-linear-to-b from-transparent to-tech-900/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </a>
                ))}
            </div>

            <div className="mt-12 text-center">
                <a
                    href="https://github.com/carry0987?tab=repositories"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-tech-500/30 text-tech-400 rounded-lg font-mono text-sm hover:bg-tech-500/10 transition-colors">
                    View All Projects on GitHub
                    <ExternalLink size={16} />
                </a>
            </div>
        </div>
    );
}
