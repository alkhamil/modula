/** Envelope response standar BE (kontrak: docs/backend-contract.md). */

export interface ResponseSchema {
  response_code: string;
  response_message: string;
}

export interface ApiResponse<T> {
  response_schema: ResponseSchema;
  response_output: T | null;
}

export function okResponse<T>(
  output: T,
  message = 'OK',
  code = '200',
): ApiResponse<T> {
  return {
    response_schema: { response_code: code, response_message: message },
    response_output: output,
  };
}

export interface Pagination {
  page: number;
  size: number;
  total_pages: number;
  total_elements: number;
}

export interface ListOutput<T> {
  list: { pagination: Pagination; content: T[] };
}

/** Paginate array in-memory (meniru `paginate` mock FE: clamp page, totalPages min 1). */
export function paginate<T>(
  items: T[],
  page: number,
  size: number,
): { pagination: Pagination; content: T[] } {
  const safeSize = Math.min(Math.max(Math.floor(size) || 10, 1), 100);
  const totalElements = items.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / safeSize));
  const safePage = Math.min(Math.max(Math.floor(page) || 1, 1), totalPages);
  return {
    pagination: {
      page: safePage,
      size: safeSize,
      total_pages: totalPages,
      total_elements: totalElements,
    },
    content: items.slice((safePage - 1) * safeSize, safePage * safeSize),
  };
}
