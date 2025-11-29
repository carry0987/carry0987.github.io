import type { UserInfo, RepoInfo } from '@/lib/interface/interfaces';
import { Background } from '@/component/background';
import { Repo } from '@/component/repo';
import { throttle, fetchData } from '@carry0987/utils';
import { DarkMode } from '@carry0987/darkmode';
import { useEffect, useState } from 'react';

// Import the images
import carry0987Logo from '@/assets/carry0987.jpg';
import githubLogo from '@/assets/github.svg';

export default function IndexPage() {
    const [repoList, updateRepoList] = useState<RepoInfo[]>([]);
    const currentYear = new Date().getFullYear();
    const menu = {
        Games: './games',
        Cydia: './cydia',
        Script: 'https://github.com/carry0987/UserJS'
    };
    const defaultRepos: RepoInfo[] = [
        {
            name: 'MessageBoard',
            full_name: 'carry0987/MessageBoard',
            description: 'A simple messageboard, use php, mysqli, js',
            html_url: 'https://github.com/carry0987/MessageBoard',
            archived: false,
            language: 'PHP'
        },
        {
            name: 'Raspberry-Pi-Repo',
            full_name: 'carry0987/Raspberry-Pi-Repo',
            description: 'The repository for Raspberry Pi',
            html_url: 'https://github.com/carry0987/Raspberry-Pi-Repo',
            archived: false,
            language: 'Shell'
        },
        {
            name: 'TemplateEngine',
            full_name: 'carry0987/TemplateEngine',
            description:
                'A lightweight and fast PHP template engine, using Composer, featuring caching abilities, customizable cache lifetime, template inheritance, and support for Redis and MySQL.',
            html_url: 'https://github.com/carry0987/TemplateEngine',
            archived: false,
            language: 'PHP'
        },
        {
            name: 'jQuery-Toggle',
            full_name: 'carry0987/jQuery-Toggle',
            description: 'Use cookie.js to save toggle setting',
            html_url: 'https://github.com/carry0987/jQuery-Toggle',
            archived: false,
            language: 'Javascript'
        },
        {
            name: '404-Error-Page',
            full_name: 'carry0987/404-Error-Page',
            description: 'A Simple Responsive 404 Error Page',
            html_url: 'https://github.com/carry0987/404-Error-Page',
            archived: false,
            language: 'HTML'
        },
        {
            name: '403-Error-Page',
            full_name: 'carry0987/403-Error-Page',
            description: 'A Simple Responsive 403 Error Page',
            html_url: 'https://github.com/carry0987/403-Error-Page',
            archived: false,
            language: 'HTML'
        },
        {
            name: 'Web-Musicbox',
            full_name: 'carry0987/Web-Musicbox',
            description: 'HTML5 musicplayer, playlist and cover',
            html_url: 'https://github.com/carry0987/Web-Musicbox',
            archived: false,
            language: 'Javascript'
        },
        {
            name: 'CKEditor-Imgur',
            full_name: 'carry0987/CKEditor-Imgur',
            description: 'A plugin for ckeditor to upload image to Imgur',
            html_url: 'https://github.com/carry0987/CKEditor-Imgur',
            archived: false,
            language: 'Javascript'
        },
        {
            name: 'Imgur-Upload',
            full_name: 'carry0987/Imgur-Upload',
            description: 'Just use javascript, no need jQuery, php',
            html_url: 'https://github.com/carry0987/Imgur-Upload',
            archived: false,
            language: 'Javascript'
        },
        {
            name: 'Responsive-Menu',
            full_name: 'carry0987/Responsive-Menu',
            description: 'A very simple responsive menu',
            html_url: 'https://github.com/carry0987/Responsive-Menu',
            archived: false,
            language: 'CSS'
        },
        {
            name: 'Webcam',
            full_name: 'carry0987/Webcam',
            description: 'Very simple html5 webcam',
            html_url: 'https://github.com/carry0987/Webcam',
            archived: false,
            language: 'HTML'
        },
        {
            name: 'Canvas-Clock',
            full_name: 'carry0987/Canvas-Clock',
            description: 'A simple canvas clock',
            html_url: 'https://github.com/carry0987/Canvas-Clock',
            archived: false,
            language: 'Javascript'
        }
    ];

    // Fetch data from the GitHub API
    const [userInfo, updateUserInfo] = useState<UserInfo>({
        avatar_url: '',
        bio: 'Still learning HTML, CSS, PHP, Javascript, Python, C, Java',
        html_url: 'https://github.com/carry0987',
        public_repos: 0,
        repos_url: ''
    });
    const fetchGithubRepo = throttle(async () => {
        try {
            updateUserInfo(
                await fetchData<UserInfo>({
                    url: 'https://api.github.com/users/carry0987',
                    method: 'GET'
                })
            );
        } catch (error) {
            return;
        }
    }, 100);

    useEffect(() => {
        const fetchRepoList = async () => {
            if (userInfo && userInfo.public_repos > 0) {
                updateRepoList(
                    await fetchData<RepoInfo[]>({
                        url: userInfo.repos_url,
                        method: 'GET',
                        data: {
                            sort: 'pushed',
                            direction: 'desc',
                            per_page: 200
                        }
                    })
                );
            }
        };
        fetchRepoList();
    }, [userInfo]);

    useEffect(() => {
        new DarkMode({
            autoDetect: true,
            preferSystem: false
        });
        fetchGithubRepo();
    }, []);

    return (
        <>
            <Background />
            <div className="container mx-auto p-4 relative z-1">
                <div className="bg-gray-800 text-white text-center flex justify-around rounded overflow-hidden">
                    {Object.entries(menu).map(([text, link], index, array) => (
                        <a
                            key={index}
                            href={link} // Use the link from the menu object
                            target={link.startsWith('http') ? '_blank' : '_self'}
                            className={`font-bold text-xl py-2 ${index !== array.length - 1 ? 'border-r border-gray-400' : ''} w-full hover:bg-blue-300 hover:text-black transition-colors duration-300`}>
                            {text} {/* Display text from the menu object */}
                        </a>
                    ))}
                </div>
                <div className="flex flex-col lg:flex-row mt-4">
                    <div className="w-full lg:w-1/4 bg-white p-4 rounded-lg shadow-lg mb-4 lg:mb-0 flex flex-row lg:flex-col">
                        <div id="profile" className="text-center lg:mt-4">
                            <div className="rounded mx-auto flex justify-center">
                                <img src={carry0987Logo} alt="Profile" className="rounded mx-auto" />
                            </div>
                            <div className="font-bold mt-2 lg:mt-4 text-2xl lg:text-4xl">
                                <span>carry0987</span>
                            </div>
                            <a
                                href={userInfo.html_url}
                                target="_blank"
                                className="text-blue-500 text-xl lg:text-3xl hover:underline">
                                @carry0987
                            </a>
                        </div>
                        <div id="bio" className="text-center ml-2 lg:ml-0 lg:mt-4">
                            <p className="text-gray-500 lg:mt-4">{userInfo.bio}</p>
                        </div>
                    </div>
                    <div className="w-full lg:w-3/4 lg:ml-4">
                        <div className="text-center font-bold text-xl mb-4">
                            <span>Repositories Source</span>
                        </div>
                        <div className="border-t-2 border-gray-300 my-1 mb-3"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {repoList.length > 0
                                ? repoList.map((repo, index) => (
                                      <Repo
                                          key={index}
                                          name={repo.name}
                                          description={repo.description}
                                          language={repo.language}
                                          html_url={repo.html_url}
                                      />
                                  ))
                                : defaultRepos.map((repo, index) => (
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
