export enum Resolution {
	P144 = "P144",
	P240 = "P240",
	P360 = "P360",
	P480 = "P480",
	P720 = "P720",
	P1080 = "P1080",
	P1440 = "P1440",
	P2160 = "P2160"
}

export type VideoDbType = {
	id: number,
	title: string,
	author: string,
	canBeDownloaded: boolean,
	minAgeRestriction: number | null,
	createdAt: string,
	publicationDate: string,
	availableResolutions: Resolution[]
}

export type CreateVideoRequest = {
	title: string,
	author: string,
	availableResolutions: Resolution[]
}

export type UpdateVideoRequest = {
	title: string,
	author: string,
	availableResolutions: Resolution[],
	canBeDownloaded?: boolean,
	minAgeRestriction?: number | null,
	publicationDate?: string
}

export type ErrorMessages = {
	field: string,
	message: string
}

export type Error = {
	errorMessages: ErrorMessages[]
}
