export const generatePaginationNumbers = (
  currentPage: number,
  totalPages: number
) => {
  // Si el numero de paginas es 7 o menos
  // vamos am ostrar todas las paginas sin puntos suspensivos

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Si la pagina actual está entre las primeras tres paginas
  // mostrar las primeras 3, puntos suspensivos, y las ultimas 2

  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // si la pagina actual está entre las ultimas 3 paginas
  // mostrar las primeras 2, puntos suspensivos, y las ultimas 3

  if (currentPage > totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // si la pagina actual está en otro lugar medio
  // mostrar la primera pagina, puntos supsnsivos, la pagina actual, y vecinos

  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

export const sleep = (seconds: number) => {
  return new Promise((resolve, reject) =>
    setTimeout(() => resolve(true), seconds * 1000)
  );
};
