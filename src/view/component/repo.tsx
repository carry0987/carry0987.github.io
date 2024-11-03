import { RepoProps } from '@/type/repo';

export const Repo = ({ name, description, language, html_url }: RepoProps) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-lg text-start">
            <a className="font-bold text-blue-500 hover:underline" href={html_url}>
                {name}
            </a>
            <div className="mt-2 mb-3 truncate hover:text-wrap">{description}</div>
            <div className="text-yellow-500">{language}</div>
        </div>
    );
};
