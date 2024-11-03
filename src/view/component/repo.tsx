import { RepoProps } from '@/type/repo';

export const Repo = ({ name, description, language, html_url }: RepoProps) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-lg">
            <a className="font-bold text-blue-500" href={html_url}>
                {name}
            </a>
            <div>{description}</div>
            <div className="text-yellow-500">{language}</div>
        </div>
    );
};
