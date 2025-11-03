import { Link } from 'react-router';
import type { RepoProps } from '@/lib/type/repo';

export const Repo = ({ name, description, language, html_url }: RepoProps) => {
    const isExternal = html_url.startsWith('http');

    return (
        <div className="bg-white p-4 rounded-lg shadow-lg text-start">
            {isExternal ? (
                <a
                    className="font-bold text-blue-500 hover:underline"
                    href={html_url}
                    target="_blank"
                    rel="noopener noreferrer">
                    {name}
                </a>
            ) : (
                <Link className="font-bold text-blue-500 hover:underline" to={html_url}>
                    {name}
                </Link>
            )}
            <div className="mt-2 mb-3 truncate hover:text-wrap">{description}</div>
            <div className="text-yellow-500">{language}</div>
        </div>
    );
};
