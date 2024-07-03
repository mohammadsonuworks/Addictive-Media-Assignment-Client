export function validate_email(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function count_num_of_words_in_text(text) {
  if (text === "") return 0;
  return text.split(" ").length;
}
