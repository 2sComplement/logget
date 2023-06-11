export interface File {
    name: string;
    size: number;
}

export interface Dir {
    name: string;
}

export interface DirectoryContents {
    path: string;
    files: File[];
    dirs: Dir[];
}
