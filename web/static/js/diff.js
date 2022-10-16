

let body = document.getElementById("body");
body.addEventListener("keydown", func)
let what = document.getElementById("wut");

var one = '',
    temp = '',
    empty = '',
    other = 'I have a cas',
    color = '';


function func(event) {
    temp = body.innerHTML;
    what = temp;
    console.log(event);
    one = temp;

}

let span = null;

const diff = Diff.diffWords(one, other),
    display = document.getElementById('display'),
    fragment = document.createDocumentFragment();

diff.forEach((part) => {
  // green for additions, red for deletions
  // grey for common parts
  const color = part.added ? 'green' :
    part.removed ? 'red' : 'grey';
  span = document.createElement('span');
  span.style.color = color;
  span.appendChild(document
    .createTextNode(part.value));
  fragment.appendChild(span);
});


display.appendChild(fragment);
