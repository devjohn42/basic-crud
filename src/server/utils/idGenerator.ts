let id = 1;

export function idGenerator(): string {
	return String(id++);
}
