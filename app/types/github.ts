// GitHub API types
export interface UserInfo {
    avatar_url: string;
    bio: string;
    html_url: string;
    public_repos: number;
    repos_url: string;
    [key: string]: any;
}

export interface RepoInfo {
    name: string;
    full_name: string;
    html_url: string;
    description: string;
    archived: boolean;
    language: string;
    topics?: string[];
    [key: string]: any;
}
