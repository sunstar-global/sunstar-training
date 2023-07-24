export default async function decorate(block) {
  block.querySelectorAll('a').forEach((a) => {
    a.target = '_blank';
  });
}
