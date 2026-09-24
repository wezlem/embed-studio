export type LinkButton = {
  id: number;
  label: string;
  url: string;
};

export const MAX_BUTTONS = 5;

export const isUsableButton = (button: LinkButton) =>
  button.label.trim() !== "" && /^https?:\/\/\S+$/i.test(button.url.trim());