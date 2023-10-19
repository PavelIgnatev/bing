export const replaceALl = (str: string, find: string, replace: string) => {
  const regex = new RegExp(find, "g");

  return str.replace(regex, replace);
};
