fetch('http://127.0.0.1:8001/v1/cars/')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Помилка:', error));