import type { ReactNode } from 'react';

export class TSXUtils {
	static replaceWithElement(
		source: string,
		...replacements: { toReplace: string; value: (key: number) => ReactNode }[]
	) {
		let result: ReactNode[] = [source];
		let replacementKey = 0;

		replacements.forEach(replacement => {
			result.forEach((element, index) => {
				const newNodes: ReactNode[] = [];
				if (typeof element === 'string') {
					element.split(replacement.toReplace).forEach((e, i, a) => {
						newNodes.push(e);
						if (i !== a.length - 1) {
							newNodes.push(replacement.value(replacementKey++));
						}
					});
				} else {
					newNodes.push(element);
				}

				if (newNodes.length > 1) {
					result = [...result.slice(0, index), ...newNodes, ...result.slice(index + 1)];
				}
			});
		});

		return result;
	}
}
