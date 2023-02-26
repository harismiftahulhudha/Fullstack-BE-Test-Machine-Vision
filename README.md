# Fullstack BE Test Machine Vision
Pada projek ini saya menggunakan [Node JS](https://nodejs.org/). Untuk css saya menggunakan framework [Express](https://expressjs.com/) dan untuk database menggunakan [MySQL](https://www.mysql.com/) dan untuk ORM menggunakan [Sequelize](https://sequelize.org/).
Projek ini berbasis microservices yang menggunakan [GRPC](https://grpc.io/) dan [Protocol Buffers](https://protobuf.dev/). Dan menggunkan arsitektur [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html).

## Project Structure
* [databases](#databases_directory)
  * [dao](#databases_dao_directory)
  * [mysql](#databases_mysql_directory)
    * [migrations](databases_mysql_migrations_directory)
    * [models](databases_mysql_models_directory)
    * [repositories](databases_mysql_repositories_directory)
    * [usecases](databases_mysql_usecases_directory)
* [frameworks](#frameworks_directory)
* [protos](#protos_directory)
* [services](#services_directory)
  * [server](#services_server_directory)
  * [client](#services_client_directory)
* [src](#src_directory)
  * [interactors](#src_interactors_directory)
* [utils](#utils_directory)

### <a name="databases_directory"></a>databases
Direktori ini berisi direktori dao dan database yang anda gunakan, dalam hal ini saya memakai [MySQL](https://www.mysql.com/).

### <a name="databases_dao_directory"></a>databases > dao
Dao merupakan kepanjangan dari Database Access Object. Dalam direktori ini berisi file file function untuk mengakses database yang ada pada folder database yang anda gunakan sebelum data di akses keluar.

### <a name="databases_mysql_directory"></a>databases > mysql
Direktori database mysql. direktori ini bisa anda ganti atau tambahkan dengan database lain yang ingin anda gunakan.

### <a name="databases_mysql_migrations_directory"></a>databases > mysql > migrations
Direktori ini berisi file migrasi yang biasa di pakai untuk pengembangan tabel SQL. Direktori ini bersifat optional. Jika anda menggunakan database lain anda tidak perlu membuat direktori ini.

### <a name="databases_mysql_models_directory"></a>databases > mysql > models
Direktori ini berisi file model dari database.

### <a name="databases_mysql_repositories_directory"></a>databases > mysql > repositories
Direktori ini berisi file repository untuk mengakses fungsi usecase. File repository berfungsi untuk jembatan menuju DAO (Database Access Object).

### <a name="databases_mysql_usecases_directory"></a>databases > mysql > usecases
Direktori ini berisi file use case. file usecase ini berisi fungsi untuk menjalan perintah database.

### <a name="frameworks_directory"></a>frameworks
Direktori ini berisi framework yang anda gunakan. dalam hal projek ini menggunakan express. 

### <a name="protos_directory"></a>protos
Direktori ini berisi kumpulan file protocol buffers. 

### <a name="services_directory"></a>services
Direktori ini berisi kumpulan services untuk setiap API.

### <a name="services_server_directory"></a>services > server
Direktori ini berisi file server yang dipakai sebagai perantara antara database ke client menggunakan GRPC.

### <a name="services_client_directory"></a>services > client
Direktori ini berisi file client menggunakan GRPC untuk mendapatkan nilai balik dari server yang kemudian di keluarkan menggunakan controller.

### <a name="src_directory"></a>src
Direktori ini berisi kumpulan src, seperti asset, image, interactors, dan lain lain.

### <a name="src_interactors_directory"></a>src > interactors
Direktori ini berisi file interactor. File interactor ini berfungsi untuk menghubungkan DAO ke Server.

### <a name="utils_directory"></a>utils
Direktori ini berisi kumpulan file utility.

## How to Install
```
- git clone https://github.com/harismiftahulhudha/Fullstack-BE-Test-Machine-Vision.git
- npm install
- npm install -g pm2
- pm2 start ecosystem.config.js
```