import type { Route } from './+types/tools';
import { Link } from 'react-router';
import { Wrench, ArrowRight, Image, Timer, Upload, MessageCircle, Palette, Atom } from 'lucide-react';

export function meta({}: Route.MetaArgs) {
    return [{ title: 'Tools | Carry' }, { name: 'description', content: 'A collection of useful tools' }];
}

export default function ToolsPage() {
    const tools = [
        {
            title: '3D Periodic Table',
            desc: 'An interactive 3D Periodic Table explorer. Explore elements in 3D space with atomic, crystal, and reaction views.',
            tech: ['React', 'Three.js', 'React Three Fiber'],
            category: 'Education',
            icon: Atom,
            toolUrl: '/tools/3d-periodic-table'
        },
        {
            title: 'Nippon Colors',
            desc: 'Browse traditional Japanese colors (日本の伝統色), search by name, and copy HEX/RGB/CMYK.',
            tech: ['React', 'Color Utils', 'Clipboard API'],
            category: 'Design',
            icon: Palette,
            toolUrl: '/tools/nippon-colors'
        },
        {
            title: 'SVG Generator',
            desc: 'Generate custom SVG graphics using AI-powered prompts. Create unique vector artwork with the help of Gemini API.',
            tech: ['React', 'Gemini API', 'SVG'],
            category: 'AI',
            icon: Image,
            toolUrl: '/tools/svg-generator'
        },
        {
            title: 'FocusFlow Widget',
            desc: 'A productivity widget that tracks your active engagement sessions. Utilizes Page Visibility API to pause when you switch tabs.',
            tech: ['React', 'Hooks', 'Visibility API'],
            category: 'Productivity',
            icon: Timer,
            toolUrl: '/tools/focusflow-widget'
        },
        {
            title: 'Imgur Drop',
            desc: 'Drag and drop images to upload them instantly to Imgur. Get shareable links with just one click.',
            tech: ['React', 'Imgur API', 'Drag & Drop'],
            category: 'Utility',
            icon: Upload,
            toolUrl: '/tools/imgur-drop'
        },
        {
            title: 'Fake Chat',
            desc: 'Create realistic fake chat screenshots for Instagram, LINE, and Messenger. Perfect for mockups and creative projects.',
            tech: ['React', 'OpenAI API', 'Gemini API', 'html-to-image'],
            category: 'Creative',
            icon: MessageCircle,
            toolUrl: '/tools/fakechat'
        }
    ];

    return (
        <div className="animate-slide-up">
            <div className="flex items-center gap-4 mb-12">
                <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                    <span className="text-tech-400 font-mono">
                        <Wrench />
                    </span>{' '}
                    Tool Box
                </h2>
                <div className="h-px bg-slate-800 grow max-w-xs"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool, idx) => (
                    <div
                        key={idx}
                        className="group relative bg-dark-card/50 border border-white/5 rounded-2xl overflow-hidden hover:border-tech-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(56,189,248,0.2)] flex flex-col h-full">
                        <div className="p-6 flex flex-col grow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-tech-500/10 rounded-lg text-tech-400 group-hover:scale-110 transition-transform duration-300">
                                    <tool.icon size={24} />
                                </div>
                                <span className="px-2 py-1 text-[10px] font-mono rounded-full bg-white/5 border border-white/10 text-slate-400 uppercase tracking-wider">
                                    {tool.category}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-tech-400 transition-colors">
                                {tool.title}
                            </h3>

                            <p className="text-slate-400 text-sm leading-relaxed mb-6 grow">{tool.desc}</p>

                            <div className="flex flex-col gap-4 mt-auto">
                                <div className="flex flex-wrap gap-2">
                                    {tool.tech.map((t) => (
                                        <span key={t} className="text-xs font-mono text-slate-500">
                                            #{t}
                                        </span>
                                    ))}
                                </div>

                                <Link
                                    to={tool.toolUrl}
                                    className="w-full py-2 rounded-lg bg-white/5 hover:bg-tech-600 hover:text-white border border-white/10 hover:border-tech-500 transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2 group-hover:bg-tech-600/20">
                                    Open Tool <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>

                        {/* Tech Hover Gradient Overlay */}
                        <div className="absolute inset-0 bg-linear-to-b from-transparent to-tech-900/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                ))}
            </div>
        </div>
    );
}
