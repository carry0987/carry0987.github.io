import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Terminal, Code2, Cpu, Gamepad2, Mail, Menu, X } from 'lucide-react';

const navLinks = [
    { path: '/', label: 'Hello', icon: Terminal },
    { path: '/projects', label: 'Projects', icon: Code2 },
    { path: '/skills', label: 'Skills', icon: Cpu },
    { path: '/games', label: 'Games', icon: Gamepad2 },
    { path: '/contact', label: 'Contact', icon: Mail }
];

export const Navbar = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentPath, setCurrentPath] = useState<string | null>(null);

    // Sync currentPath with location.pathname on client-side
    useEffect(() => {
        // Remove trailing slash for consistent comparison (but keep '/' as is)
        const path = location.pathname === '/' ? '/' : location.pathname.replace(/\/$/, '');
        setCurrentPath(path);
    }, [location.pathname]);

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    // Prevent background scrolling when the menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    return (
        <>
            {/* Desktop Navbar */}
            <div className="hidden md:flex fixed top-6 left-0 right-0 z-50 justify-center px-4">
                <nav className="glass-nav px-2 py-2 rounded-full flex items-center gap-2">
                    {navLinks.map((link) => {
                        const isActive = currentPath === link.path;
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

            {/* Mobile Hamburger Button */}
            <div className="md:hidden fixed top-4 right-4 z-50">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="glass-nav p-3 rounded-xl transition-all duration-300 text-slate-300 hover:text-tech-400"
                    aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={`
                    md:hidden fixed inset-0 z-40 transition-all duration-300
                    ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                `}>
                {/* Backdrop */}
                <div className="absolute inset-0 bg-dark-bg/80 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />

                {/* Menu Panel */}
                <nav
                    className={`
                        absolute top-20 left-4 right-4 glass-nav rounded-2xl p-4
                        transition-all duration-300 transform
                        ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}
                    `}>
                    <div className="flex flex-col gap-2">
                        {navLinks.map((link) => {
                            const isActive = currentPath === link.path;
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-sm
                                        transition-all duration-300
                                        ${
                                            isActive
                                                ? 'bg-tech-500/10 text-tech-400 shadow-[0_0_10px_rgba(56,189,248,0.2)]'
                                                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 active:bg-white/10'
                                        }
                                    `}>
                                    <Icon size={20} />
                                    <span>{link.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            </div>
        </>
    );
};
