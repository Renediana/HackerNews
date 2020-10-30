export interface Story {
    by: string,
    descendants: number,
    id: number,
    kids: any,
    score: number,
    time: number,
    title: string,
    type: string,
    url: string
}

export interface VotedStory extends Story {
    vote: number,
    isUpVoted: boolean,
    isDownVoted: boolean
}