const API_KEY = '32683324-b0ce690598d4af74b245f496c';
const API_URL = 'https://pixabay.com/api/?key=';

async function fetchMain() {
  await fetch(API_URL + API_KEY).then(response => {
    console.log(response);
  });
}
fetchMain(response);

function constructPage(images) {


}
