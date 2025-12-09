import React from 'react';
import { Link } from 'react-router';
import { Timer, ArrowLeft, Eye, Clock, Zap } from 'lucide-react';
import { FocusWidget } from './components/FocusWidget';

const FocusFlowPage: React.FC = () => {
    return (
        <>
            <div className="animate-slide-up">
                {/* Back Link */}
                <Link
                    to="/tools"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-tech-400 transition-colors mb-8 group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back to Tools</span>
                </Link>

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-tech-500/10 rounded-xl text-tech-400 border border-tech-500/20">
                        <Timer size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">FocusFlow Widget</h1>
                        <p className="text-slate-400 text-sm mt-1">Track your engagement sessions automatically</p>
                    </div>
                </div>

                {/* Demo Notice */}
                <div className="p-5 rounded-2xl bg-dark-card/50 border border-tech-500/20 mb-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-tech-600/10 rounded-full blur-3xl group-hover:bg-tech-600/20 transition-colors duration-700"></div>
                    <div className="flex items-start gap-4 relative">
                        <div className="p-2 bg-tech-500/20 rounded-lg text-tech-400 shrink-0">
                            <Eye size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-1">Interactive Demo</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Look at the <span className="text-tech-400 font-medium">bottom right</span> of your
                                screen. The widget tracks your presence. Try switching tabs or minimizing this
                                window—the progress will pause automatically.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                    {[
                        {
                            icon: Eye,
                            title: 'Visibility Detection',
                            desc: 'Uses Page Visibility API to detect when you leave the page'
                        },
                        {
                            icon: Clock,
                            title: 'Session Tracking',
                            desc: 'Counts completed focus sessions automatically'
                        },
                        {
                            icon: Zap,
                            title: 'Real-time Progress',
                            desc: 'Visual progress indicator with smooth animations'
                        }
                    ].map((feature, idx) => (
                        <div
                            key={idx}
                            className="p-4 rounded-xl bg-dark-card/30 border border-white/5 hover:border-tech-500/30 transition-all duration-300">
                            <div className="p-2 bg-tech-500/10 rounded-lg text-tech-400 w-fit mb-3">
                                <feature.icon size={18} />
                            </div>
                            <h4 className="text-white font-semibold mb-1">{feature.title}</h4>
                            <p className="text-slate-500 text-sm">{feature.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Content */}
                <div className="space-y-8">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="text-tech-400 font-mono text-sm">01.</span> How It Works
                        </h2>
                        <p className="text-slate-400 leading-relaxed">
                            The tracking mechanism utilizes the{' '}
                            <code className="text-tech-400 bg-tech-950/30 px-1.5 py-0.5 rounded text-sm font-mono">
                                Page Visibility API
                            </code>{' '}
                            alongside window focus events. This ensures that "engagement" means you are actually looking
                            at the content, not just having the tab open in the background.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="text-tech-400 font-mono text-sm">02.</span> Widget Architecture
                        </h2>
                        <ul className="space-y-3">
                            {[
                                {
                                    title: 'Floating State',
                                    desc: 'A non-intrusive FAB (Floating Action Button) shows progress at a glance.'
                                },
                                {
                                    title: 'Expanded State',
                                    desc: 'Provides detailed context, controls, and feedback.'
                                },
                                {
                                    title: 'State Management',
                                    desc: 'React hooks handle visibility logic efficiently.'
                                }
                            ].map((item, idx) => (
                                <li
                                    key={idx}
                                    className="flex items-start gap-3 p-3 rounded-lg bg-dark-card/30 border border-white/5">
                                    <span className="text-tech-400 font-mono text-xs mt-1">▸</span>
                                    <div>
                                        <span className="text-white font-medium">{item.title}:</span>{' '}
                                        <span className="text-slate-400">{item.desc}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="text-tech-400 font-mono text-sm">03.</span> Deep Work
                        </h2>
                        <p className="text-slate-400 leading-relaxed">
                            Deep work is the ability to focus without distraction on a cognitively demanding task. It's
                            a skill that allows you to quickly master complicated information and produce better results
                            in less time. Deep work will make you better at what you do and provide the sense of true
                            fulfillment that comes from craftsmanship.
                        </p>
                    </section>
                </div>
            </div>

            {/* The Widget Instance - Outside transform container for proper fixed positioning */}
            <FocusWidget />
        </>
    );
};

export function meta() {
    return [
        { title: 'FocusFlow Widget | Carry' },
        {
            property: 'og:title',
            content: 'FocusFlow Widget'
        },
        {
            name: 'description',
            content: 'FocusFlow Widget - Track your engagement sessions automatically with Page Visibility API.'
        }
    ];
}

export default FocusFlowPage;
