
export type ProjectId = string;

export interface Project {
    id: ProjectId;
    name: string | null;
}

export interface RemoteData<T> {
    isLoading: boolean;
    data?: T;
    error?: string;
}
