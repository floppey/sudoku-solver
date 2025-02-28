export const formatOptions = (options: string[], validOptions: string[]) => {
  const formattedOptions: string[] = [];
  validOptions.forEach((validOption, i) => {
    formattedOptions.push(
      options.includes(validOption) ? `${validOption}` : " "
    );
    if (
      i % Math.sqrt(validOption.length) ===
      Math.sqrt(validOption.length) - 1
    ) {
      formattedOptions.push("\n");
    }
  });
  return formattedOptions.join(" ").replace(/\n\s/g, "\n");
};
