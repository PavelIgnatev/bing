export const filterStrings = (inputStrings: Array<string>) => {
  const filteredStrings: Array<string> = [];

  for (const string of inputStrings) {
    // Используем регулярное выражение для фильтрации символов
    const filteredString = string.replace(/[^А-Яа-яA-Za-z0-9]/g, "");
    filteredStrings.push(filteredString);
  }

  return filteredStrings;
};
