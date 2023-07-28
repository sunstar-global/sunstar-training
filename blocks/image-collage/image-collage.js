export default function decorate(block) {
  const childrens = [...block.children];

  if (block.classList.contains('image-with-caption')) {
    childrens.forEach((x) => {
      const img = x.querySelector('picture');

      if (img && img.parentElement && img.parentElement.nextElementSibling && img.parentElement.nextElementSibling.tagName === 'DIV') {
        img.parentElement.nextElementSibling.classList.add('image-caption');
      }
    });
  }
}
