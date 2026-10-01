export const listEmptyState = (
  moduleListName: string,
  description = 'There are no records to display at the moment.',
) =>
  ({
    title: `${moduleListName} List is Empty`,
    description,
  }) as const;
