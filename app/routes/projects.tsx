import type { Route } from './+types/projects';
import type { RepoInfo } from '@/types/github';
import { Code2, ExternalLink, Command, Pin } from 'lucide-react';
import { fetchData } from '@carry0987/utils';
import { useEffect, useState, useCallback } from 'react';

export function meta({}: Route.MetaArgs) {
    return [{ title: 'Projects | Carry' }, { name: 'description', content: 'A list of my projects' }];
}

interface ProjectInfo {
    title: string;
    desc: string;
    topic: string[];
    link: string;
    isPinned?: boolean;
}

// Pinned projects (fixed list)
const pinnedProjects: ProjectInfo[] = [
    {
        title: 'PHP-I18n',
        desc: 'A modern internationalization system featuring JSON-format language files and efficient PHP-based caching. Supports dynamic language switching and real-time cache updates, ideal for rapid development and deployment of multilingual websites and applications.',
        topic: ['i18n', 'json', 'cookie', 'cache', 'php8', 'composer'],
        link: 'https://github.com/carry0987/PHP-I18n',
        isPinned: true
    },
    {
        title: 'TemplateEngine',
        desc: 'A lightweight and fast PHP template engine, using Composer, featuring caching abilities, customizable cache lifetime, template inheritance, and support for Redis and MySQL.',
        topic: ['redis', 'template-engine', 'pdo', 'xxhash', 'php8', 'composer'],
        link: 'https://github.com/carry0987/TemplateEngine',
        isPinned: true
    },
    {
        title: 'Paginator-JS',
        desc: 'Advanced library for create and manage pagination.',
        topic: ['react', 'pagination', 'typescript', 'preact', 'rollup', 'pnpm'],
        link: 'https://github.com/carry0987/Paginator-JS',
        isPinned: true
    },
    {
        title: 'Imgur-Upload',
        desc: 'A library for upload images to imgur, no dependencies, no need jQuery, PHP.',
        topic: ['image', 'typescript', 'html5', 'javascript', 'api'],
        link: 'https://github.com/carry0987/Imgur-Upload',
        isPinned: true
    },
    {
        title: 'ImgCheckBox-JS',
        desc: 'Seamlessly transform your images into interactive checkboxes with ImgCheckBox, a versatile and easy-to-use JavaScript library designed to enhance user interfaces by introducing customizable image-based selection functionality.',
        topic: ['typescript', 'checkbox', 'imgcheckbox'],
        link: 'https://github.com/carry0987/ImgCheckBox-JS',
        isPinned: true
    },
    {
        title: 'Docker-Image',
        desc: 'Explore my GitHub repository for Dockerfiles tailored to various development environments. Streamline your project setup and deployment processes, making development effortless. Activate the perfect development container for your needs now!.',
        topic: ['docker-image', 'dockerfile', 'development', 'containers'],
        link: 'https://github.com/carry0987/Docker-Image',
        isPinned: true
    }
];

// Get pinned project URLs for filtering
const pinnedUrls = new Set(pinnedProjects.map((p) => p.link));

// Convert RepoInfo from REST API to ProjectInfo
const convertRepoToProject = (repo: RepoInfo): ProjectInfo => {
    const topics = (repo.topics as string[]) || [];
    const topic = repo.language ? [repo.language, ...topics] : topics;
    return {
        title: repo.name,
        desc: repo.description || 'No description available',
        topic: topic.slice(0, 5), // Limit to 5 tags
        link: repo.html_url,
        isPinned: false
    };
};

export default function ProjectsPage() {
    const [projects, setProjects] = useState<ProjectInfo[]>(pinnedProjects);

    // Fetch repos using REST API with topics
    const fetchRepos = useCallback(async () => {
        try {
            const repoList = await fetchData<RepoInfo[]>({
                url: 'https://api.github.com/users/carry0987/repos',
                method: 'GET',
                data: {
                    sort: 'pushed',
                    direction: 'desc',
                    per_page: 12
                }
            });
            if (repoList && repoList.length > 0) {
                // Filter out repos that are already in pinned list
                const filteredRepos = repoList
                    .filter((repo) => !pinnedUrls.has(repo.html_url))
                    .map(convertRepoToProject);
                // Combine pinned projects with fetched repos
                setProjects([...pinnedProjects, ...filteredRepos]);
            }
        } catch (error) {
            console.error('Failed to fetch repo list:', error);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchRepos();
    }, [fetchRepos]);

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
                                <div className="flex items-center gap-2">
                                    {project.isPinned && (
                                        <span title="Pinned Repository">
                                            <Pin size={16} className="text-yellow-500" />
                                        </span>
                                    )}
                                    <ExternalLink
                                        size={20}
                                        className="text-slate-500 group-hover:text-white transition-colors"
                                    />
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-tech-400 transition-colors">
                                {project.title}
                            </h3>

                            <p className="text-slate-400 text-sm leading-relaxed mb-6 grow">{project.desc}</p>

                            <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                                {project.topic.map((t) => (
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
