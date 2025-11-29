import { Link, useLocation } from 'react-router';
import { Terminal, Code2, Cpu, Gamepad2, Mail } from 'lucide-react';

const navLinks = [
    { path: '/', label: '_hello', icon: <Terminal size={14} /> },
    { path: '/projects', label: '_projects', icon: <Code2 size={14} /> },
    { path: '/skills', label: '_skills', icon: <Cpu size={14} /> },
    { path: '/games', label: '_games', icon: <Gamepad2 size={14} /> },
    { path: '/contact', label: '_contact', icon: <Mail size={14} /> }
];

export const Navbar = () => {
    const location = useLocation();

    return (
        <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
            <nav className="glass-nav px-2 py-2 rounded-full flex items-center gap-1 sm:gap-2 max-w-full overflow-x-auto no-scrollbar">
                {navLinks.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`
                                relative px-4 py-2 rounded-full text-xs sm:text-sm font-mono transition-all duration-300 flex items-center gap-2 whitespace-nowrap
                                ${isActive ? 'bg-tech-500/10 text-tech-400 shadow-[0_0_10px_rgba(56,189,248,0.2)]' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}
                            `}>
                            {link.icon}
                            {link.label}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};
