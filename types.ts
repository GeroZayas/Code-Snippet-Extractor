
export interface Snippet {
  title: string;
  description: string;
  language: string;
  code: string;
}

export interface SnippetGroup {
  groupTitle: string;
  groupDescription: string;
  snippets: Snippet[];
}
