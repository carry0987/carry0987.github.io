import { Link, useLocation } from 'react-router';
import { Terminal, Code2, Cpu, Gamepad2, Mail } from 'lucide-react';

const navLinks = [
    { path: '/', label: 'Hello', icon: Terminal },
    { path: '/projects', label: 'Projects', icon: Code2 },
    { path: '/skills', label: 'Skills', icon: Cpu },
    { path: '/games', label: 'Games', icon: Gamepad2 },
    { path: '/contact', label: 'Contact', icon: Mail }
];

export const Navbar = () => {
    const location = useLocation();

    return (
        <>
            {/* Desktop Navbar */}
            <div className="hidden md:flex fixed top-6 left-0 right-0 z-50 justify-center px-4">
                <nav className="glass-nav px-2 py-2 rounded-full flex items-center gap-2">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`
                                    relative px-4 py-2 rounded-full text-sm font-mono transition-all duration-300 flex items-center gap-2 whitespace-nowrap
                                    ${isActive ? 'bg-tech-500/10 text-tech-400 shadow-[0_0_10px_rgba(56,189,248,0.2)]' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}
                                `}>
                                <Icon size={14} />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Mobile Navbar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe">
                <nav className="glass-nav mx-3 mb-3 px-2 py-2 rounded-2xl flex items-center justify-around">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`
                                    relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300
                                    ${isActive ? 'text-tech-400' : 'text-slate-400 active:text-slate-200'}
                                `}>
                                <div
                                    className={`
                                    p-2 rounded-xl transition-all duration-300
                                    ${isActive ? 'bg-tech-500/10 shadow-[0_0_10px_rgba(56,189,248,0.2)]' : ''}
                                `}>
                                    <Icon size={20} />
                                </div>
                                <span className="text-[10px] font-mono">{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </>
    );
};
