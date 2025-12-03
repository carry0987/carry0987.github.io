import type { LucideIcon } from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';

type CustomIcon = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

interface SocialLinkProps {
    href: string;
    icon: LucideIcon | CustomIcon;
    label: string;
}

export const SocialLink = ({ href, icon: Icon, label }: SocialLinkProps) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-center p-3 rounded-xl bg-dark-card border border-dark-border hover:border-tech-500/50 hover:bg-tech-500/5 transition-all duration-300 hover:-translate-y-1"
        aria-label={label}>
        <Icon size={20} className="text-slate-400 group-hover:text-tech-400 transition-colors" />
    </a>
);
