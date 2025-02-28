export const formatOptions = (options: number[]) => {
  const formattedOptions: string[] = [];
  for (let i = 0; i < 9; i++) {
    formattedOptions.push(options.includes(i + 1) ? `${i + 1}` : " ");
    if (i % 3 === 2) {
      formattedOptions.push("\n");
    }
  }
  return formattedOptions.join(" ").replace(/\n\s/g, "\n");
};
