export interface BlogPost {
        id: number;
        title: string;
        slug: string;
        content: string;
        image: string | null;
        author: string;
        is_visible: boolean;
        created_at: string;
        updated_at: string;
        category: string;
        tags: string[];
        comments: Comment[];
        views: number;
        likes_count: number;
        excerpt: string;
    }