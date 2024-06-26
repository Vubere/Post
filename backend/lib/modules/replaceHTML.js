module.exports = function (template, product) {
  const products = product.map((item) => `<li>${item}</li>`).join("");
  const content = `<ul>${products}</ul>`;
  return template.replace("{{%CONTENT%}}", content);
};
