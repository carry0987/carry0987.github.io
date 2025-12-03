import type { Route } from './+types/contact';
import { Mail } from 'lucide-react';
import { GithubIcon, LinkedInIcon } from '@/components/icons';

export function meta({}: Route.MetaArgs) {
    return [{ title: 'Contact | Carry' }, { name: 'description', content: 'Get in touch with me' }];
}

export default function ContactPage() {
    return (
        <div className="animate-slide-up max-w-2xl mx-auto pt-10">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">Get In Touch</h2>
                <p className="text-slate-400 max-w-md mx-auto">
                    Although I may not always be available to take on projects at the moment, my inbox is always open
                    for you. Whether it's technical exchanges or collaboration opportunities, feel free to reach out!
                </p>
            </div>

            <div className="glass-panel p-1 rounded-2xl bg-linear-to-b from-white/10 to-transparent">
                <div className="bg-dark-bg/90 rounded-xl p-8 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-6">
                        <a
                            href="mailto:carry0987@gmail.com"
                            className="px-8 py-4 bg-tech-600 hover:bg-tech-500 text-white rounded-lg font-bold text-lg transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] flex items-center gap-3">
                            <Mail size={20} />
                            Say Hello
                        </a>

                        <div className="flex gap-8 mt-4">
                            <a
                                href="https://github.com/carry0987"
                                target="_blank"
                                rel="noreferrer"
                                className="flex flex-col items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                                <div className="p-4 rounded-full bg-slate-800/50 group-hover:bg-slate-700 transition-colors">
                                    <GithubIcon size={24} />
                                </div>
                                <span className="text-xs font-mono">Github</span>
                            </a>
                            <a
                                href="https://www.linkedin.com/in/carry0987"
                                target="_blank"
                                rel="noreferrer"
                                className="flex flex-col items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                                <div className="p-4 rounded-full bg-slate-800/50 group-hover:bg-[#0077b5]/20 transition-colors">
                                    <LinkedInIcon size={24} />
                                </div>
                                <span className="text-xs font-mono">LinkedIn</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
