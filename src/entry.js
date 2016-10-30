import Dog from '../src/dog';

const browserToby = new Dog('Browser Toby');

document.querySelector('body').innerText = browserToby.bark();
