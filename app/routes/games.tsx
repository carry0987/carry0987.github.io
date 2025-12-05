import type { Route } from './+types/games';
import { Link } from 'react-router';
import { Gamepad2, ArrowRight } from 'lucide-react';

export function meta({}: Route.MetaArgs) {
    return [{ title: 'Games | Carry' }, { name: 'description', content: 'A list of my games' }];
}

export default function GamesPage() {
    const games = [
        {
            title: 'BlackHole',
            desc: 'An interactive particle simulation where black holes attract and consume particles with mesmerizing visual effects.',
            tech: ['Canvas', 'Particle System', 'Physics'],
            genre: '2D',
            playUrl: '/games/blackhole'
        },
        {
            title: 'ShotBall',
            desc: 'A physics-based gravity simulation with colorful bouncing balls affected by realistic gravitational forces.',
            tech: ['Canvas', 'Physics Engine', 'Animation'],
            genre: '2D',
            playUrl: '/games/shotball'
        },
        {
            title: 'Zen Void',
            desc: 'A relaxing cyberpunk experience with floating objects, dynamic themes, and ambient slap interactions.',
            tech: ['Three.js', 'WebGL', '3D Graphics'],
            genre: '3D',
            playUrl: '/games/zenvoid'
        },
        {
            title: 'Sky Metropolis',
            desc: 'Build your dream city in the clouds with this isometric city builder featuring goals and dynamic news events.',
            tech: ['Three.js', 'WebGL'],
            genre: '3D',
            playUrl: '/games/sky-metropolis'
        },
        {
            title: 'Hand Controlled Particle Flow',
            desc: 'An interactive 3D particle system controlled by your hand gestures through webcam tracking.',
            tech: ['Three.js', 'MediaPipe', 'Hand Tracking'],
            genre: '3D',
            playUrl: '/games/hand-controlled-particle-flow'
        }
    ];

    return (
        <div className="animate-slide-up">
            <div className="flex items-center gap-4 mb-12">
                <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                    <span className="text-tech-400 font-mono">
                        <Gamepad2 />
                    </span>{' '}
                    Game Lab
                </h2>
                <div className="h-px bg-slate-800 grow max-w-xs"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map((game, idx) => (
                    <div
                        key={idx}
                        className="group relative bg-dark-card/50 border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] flex flex-col h-full">
                        <div className="p-6 flex flex-col grow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 group-hover:scale-110 transition-transform duration-300">
                                    <Gamepad2 size={24} />
                                </div>
                                <span className="px-2 py-1 text-[10px] font-mono rounded-full bg-white/5 border border-white/10 text-slate-400 uppercase tracking-wider">
                                    {game.genre}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                                {game.title}
                            </h3>

                            <p className="text-slate-400 text-sm leading-relaxed mb-6 grow">{game.desc}</p>

                            <div className="flex flex-col gap-4 mt-auto">
                                <div className="flex flex-wrap gap-2">
                                    {game.tech.map((t) => (
                                        <span key={t} className="text-xs font-mono text-slate-500">
                                            #{t}
                                        </span>
                                    ))}
                                </div>

                                <Link
                                    to={game.playUrl}
                                    className="w-full py-2 rounded-lg bg-white/5 hover:bg-purple-600 hover:text-white border border-white/10 hover:border-purple-500 transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2 group-hover:bg-purple-600/20">
                                    Play Game <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>

                        {/* Purple Hover Gradient Overlay */}
                        <div className="absolute inset-0 bg-linear-to-b from-transparent to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                ))}
            </div>
        </div>
    );
}
