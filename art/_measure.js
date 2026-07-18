addEventListener("load", () => {
  const s = document.querySelector(".stage") || document.body
  document.documentElement.setAttribute("data-w", s.offsetWidth)
  document.documentElement.setAttribute("data-h", s.offsetHeight)
})
