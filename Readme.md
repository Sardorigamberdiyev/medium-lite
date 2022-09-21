
GET http://localhost:5000/api/user/list         - Список ползователей
POST http://localhost:5000/api/user/register    - Регистрации
POST http://localhost:5000/api/user/login       - Авторизации

GET http://localhost:5000/api/post              - Получить список постов
GET http://localhost:5000/api/post/:postId      - Получить пост по id
GET http://localhost:5000/api/post/user         - Получить список своих постов (для авторизованных)
GET http://localhost:5000/api/post/user/:postId - Получить пост по id и сделать прочитанным (для авторизованных)
POST http://localhost:5000/api/post/add         - Создать пост (для авторизованных)