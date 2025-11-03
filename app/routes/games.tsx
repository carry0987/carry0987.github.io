import { Link } from 'react-router';
import type { RepoInfo } from '@/lib/interface/interfaces';
import { Background } from '@/component/background';
import { Repo } from '@/component/repo';
import type { Route } from './+types/games';

// Import the images
import githubLogo from '@/assets/github.svg';

export function meta({}: Route.MetaArgs) {
    return [{ title: 'Game List' }, { name: 'description', content: 'List of games' }];
}

export default function GameList() {
    const currentYear = new Date().getFullYear();
    const menu = {
        Home: '/',
        Cydia: '/cydia',
        Script: 'https://github.com/carry0987/UserJS'
    };
    const gameRepos: RepoInfo[] = [
        {
            name: 'BlackHole',
            full_name: '',
            description: 'A Funny Canvas Game',
            html_url: '/games/blackhole',
            archived: false,
            language: 'TypeScript'
        },
        {
            name: 'ShotBall',
            full_name: '',
            description: 'Use Canvas to creat gravity core',
            html_url: '/games/shotball',
            archived: false,
            language: 'TypeScript'
        }
    ];

    return (
        <>
            <Background />
            <div className="container mx-auto p-4 relative z-1">
                <div className="bg-gray-800 text-white text-center flex justify-around rounded overflow-hidden">
                    {Object.entries(menu).map(([text, link], index, array) => {
                        const isExternal = link.startsWith('http');
                        const className = `font-bold text-xl py-2 ${index !== array.length - 1 ? 'border-r border-gray-400' : ''} w-full hover:bg-blue-300 hover:text-black transition-colors duration-300`;

                        return isExternal ? (
                            <a key={index} href={link} target="_blank" rel="noopener noreferrer" className={className}>
                                {text}
                            </a>
                        ) : (
                            <Link key={index} to={link} className={className}>
                                {text}
                            </Link>
                        );
                    })}
                </div>
                <div className="flex flex-col lg:flex-row mt-4">
                    <div className="w-full lg:ml-4">
                        <div className="text-center font-bold text-xl mb-4">
                            <span>Game List</span>
                        </div>
                        <div className="border-t-2 border-gray-300 my-1 mb-3"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {gameRepos.map((repo, index) => (
                                <Repo
                                    key={index}
                                    name={repo.name}
                                    description={repo.description}
                                    language={repo.language}
                                    html_url={repo.html_url}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="text-center mt-8">
                    <a
                        href="https://github.com/carry0987"
                        className="text-blue-500"
                        title="carry0987 GitHub"
                        target="_blank">
                        <img src={githubLogo} alt="Github" className="w-8 inline-block" />
                    </a>
                    <div className="text-gray-500">
                        <span>&copy; {currentYear} carry0987. All rights reserved. Made by carry0987</span>
                    </div>
                </div>
            </div>
        </>
    );
}
